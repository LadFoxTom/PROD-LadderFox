import { NextRequest } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

const SYSTEM_PROMPT = `You are an expert CV/resume builder assistant. Help users build their CV through natural conversation. Be friendly, professional, and proactive — ask follow-up questions when information is incomplete.

## RESPONSE FORMAT
ALWAYS return a valid JSON object (no markdown, no code blocks):
{
  "response": "Your conversational response to the user",
  "cvUpdates": {
    // Only include fields that changed
  }
}

## cvUpdates FIELD REFERENCE
{
  "fullName": "string",
  "title": "string - professional title/headline",
  "summary": "string - professional summary paragraph",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "experience": [
    {
      "title": "string - job title",
      "company": "string",
      "location": "string",
      "dates": "string - e.g. Jan 2022 - Present",
      "achievements": ["string - action verb + result + metric"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "field": "string - field of study",
      "institution": "string",
      "dates": "string"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"]
  }
}

## RULES
1. ALWAYS return valid JSON — never wrap in \`\`\`json or markdown
2. Extract ALL information the user provides into cvUpdates
3. Only include fields that are new or changed in cvUpdates
4. If the user is just chatting (no CV info), return empty cvUpdates: {}
5. Write achievements with strong action verbs and quantified results
6. Ask the user what's missing — guide them through building a complete CV
7. Be concise in responses — 2-4 sentences max for normal conversation
8. When a user first says hello or provides initial info, respond warmly and ask what they'd like to start with

## CONVERSATION FLOW
Start by greeting the user and asking for their basic info (name, title).
Then guide through: contact → summary → experience → education → skills.
After each section, suggest the next logical section to fill in.`;

function sanitizeCvDataForContext(cvData: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...cvData };
  // Remove large binary data
  delete sanitized.photos;
  delete sanitized.photoUrl;
  return sanitized;
}

function normalizeExtractedData(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (data.fullName) result.fullName = String(data.fullName).trim();
  if (data.title) result.title = String(data.title).trim();
  if (data.summary) result.summary = String(data.summary).trim();

  if (data.contact && typeof data.contact === 'object') {
    const c = data.contact as Record<string, unknown>;
    const contact: Record<string, string> = {};
    if (c.email) contact.email = String(c.email).trim();
    if (c.phone) contact.phone = String(c.phone).trim();
    if (c.location) contact.location = String(c.location).trim();
    result.contact = contact;
  }

  if (data.experience && Array.isArray(data.experience)) {
    result.experience = data.experience.map((exp: Record<string, unknown>) => ({
      title: exp.title || exp.position || '',
      company: exp.company || exp.organization || '',
      location: exp.location || '',
      dates: exp.dates || '',
      achievements: Array.isArray(exp.achievements)
        ? exp.achievements
        : Array.isArray(exp.content)
          ? exp.content
          : [],
    }));
  }

  if (data.education && Array.isArray(data.education)) {
    result.education = data.education.map((edu: Record<string, unknown>) => ({
      degree: edu.degree || edu.title || '',
      field: edu.field || '',
      institution: edu.institution || edu.school || edu.university || '',
      dates: edu.dates || '',
    }));
  }

  if (data.skills) result.skills = data.skills;

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, cvData, conversationHistory, language = 'en' } = body;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message required' }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI not configured' }), { status: 500 });
    }

    const llm = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      temperature: 0.7,
      streaming: true,
      openAIApiKey: apiKey,
      maxTokens: 2000,
    });

    // Build messages
    const langNote = language !== 'en' ? `\n\nIMPORTANT: Respond in language code "${language}". Adapt your responses to this language.` : '';
    const messages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT + langNote)];

    // Add conversation history (last 10 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) {
        if (msg.role === 'user') {
          messages.push(new HumanMessage(String(msg.content || '')));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(String(msg.content || '')));
        }
      }
    }

    // Add current CV context
    if (cvData && typeof cvData === 'object' && Object.keys(cvData).length > 0) {
      const sanitized = sanitizeCvDataForContext(cvData);
      messages.push(new SystemMessage(`Current CV data:\n${JSON.stringify(sanitized, null, 2)}`));
    }

    messages.push(new HumanMessage(message));

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        const response = await llm.stream(messages);
        let fullResponse = '';

        for await (const chunk of response) {
          const content = chunk.content as string;
          if (content) fullResponse += content;
        }

        // Parse JSON from response
        let cvUpdates: Record<string, unknown> | null = null;
        let cleanResponse = fullResponse;

        try {
          let jsonText = fullResponse.trim();
          // Remove markdown code blocks if present
          if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
          }

          const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.response) cleanResponse = parsed.response;
            if (parsed.cvUpdates && typeof parsed.cvUpdates === 'object' && Object.keys(parsed.cvUpdates).length > 0) {
              cvUpdates = normalizeExtractedData(parsed.cvUpdates);
            }
          }
        } catch {
          // If JSON parsing fails, use raw response as text
          cleanResponse = fullResponse;
        }

        // Send cv_update event if we have updates
        if (cvUpdates) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ type: 'cv_update', updates: cvUpdates })}\n\n`)
          );
        }

        // Stream response word by word
        const words = cleanResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ type: 'token', content: word })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 15));
        }

        // Done
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', response: cleanResponse })}\n\n`)
        );
      } catch (err) {
        console.error('Streaming error:', err);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', message: 'AI processing failed. Please try again.' })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('CV chat error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
