/**
 * Orchestrator Agent
 * 
 * Main routing agent that analyzes user intent and directs requests
 * to appropriate specialized agents. This is the entry point for all user interactions.
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { CareerServiceStateType, ImageContent } from "../state/agent-state";
import { WorkflowActions } from "../state/agent-state";
import { IntentClassificationSchema, safeParse } from "../state/schemas";
import { hasImages, extractText } from "../utils/image-processing";

// Helper to convert ImageContent to LangChain format
function convertToLangChainContent(content: string | Array<string | ImageContent>): string | Array<{ type: string; [key: string]: any }> {
  if (typeof content === "string") {
    return content;
  }
  
  return content.map(item => {
    if (typeof item === "string") {
      return { type: "text", text: item };
    } else {
      return item;
    }
  });
}

// Use vision-capable model when images are present, otherwise use standard model
function getModel(hasImages: boolean) {
  return new ChatOpenAI({
    modelName: hasImages 
      ? (process.env.OPENAI_VISION_MODEL || "gpt-4o") // gpt-4o supports vision
      : (process.env.OPENAI_MODEL || "gpt-4-turbo-preview"),
    temperature: 0.3, // Low temperature for consistent intent classification
    apiKey: process.env.OPENAI_API_KEY,
  });
}


/**
 * Create intent classification prompt
 */
function createIntentPrompt(userMessage: string, hasImages: boolean, context: {
  hasCVData: boolean;
  hasJobContext: boolean;
  hasApplicationId: boolean;
}): string {
  const imageNote = hasImages 
    ? "\n\nNOTE: The user has included image(s) in their message. Analyze the image(s) along with the text to understand their intent. Images may contain CVs, job postings, documents, or other relevant information."
    : "";

  return `You are an AI career assistant router. Analyze the user's message${hasImages ? " and any included images" : ""} and classify their intent.

USER MESSAGE: "${userMessage}"${imageNote}

CONTEXT:
- User has CV data: ${context.hasCVData ? "Yes" : "No"}
- User has job context: ${context.hasJobContext ? "Yes" : "No"}
- User has application ID: ${context.hasApplicationId ? "Yes" : "No"}

POSSIBLE INTENTS:

1. **analyze_cv**: User wants CV quality analysis, ATS check, or feedback
   - Examples: "analyze my cv", "check my resume", "how good is my cv", "ats score"

2. **find_jobs**: User wants job matching, job search, opportunities
   - Examples: "find me jobs", "what jobs match", "show opportunities", "job search"

3. **track_application**: User wants to record or update a job application
   - Examples: "I applied to", "track application", "update status", "record application"

4. **enhance_cover_letter**: User wants cover letter generation or improvement
   - Examples: "write cover letter", "improve my letter", "generate cover letter for", "help with cover letter"

5. **general_chat**: General questions, greetings, unclear intent
   - Examples: "hello", "what can you do", "help", "thanks"

OUTPUT FORMAT (JSON only):
{
  "intent": "<one of: analyze_cv, find_jobs, track_application, enhance_cover_letter, general_chat>",
  "confidence": <number 0.0-1.0>,
  "requiredData": ["<what data is needed if any>"]
}

CLASSIFICATION RULES:
- If multiple intents possible, choose the PRIMARY intent
- Check if required data is available before classifying
- If user says "both X and Y", prioritize the first mentioned
- General greetings should be "general_chat"
- Ambiguous requests should be "general_chat" with low confidence

IMPORTANT:
- Be precise in classification
- Consider conversation context
- Return ONLY valid JSON`;
}

/**
 * Orchestrator Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with routing decision
 */
export async function orchestratorAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[Orchestrator] Analyzing user intent");

  try {
    // Get latest user message
    const userMessages = state.messages.filter(m => m.role === "user");
    if (userMessages.length === 0) {
      return {
        messages: [{
          role: "assistant",
          content: "Hello! I'm your AI career assistant. I can help you with:\n\n" +
                   "📊 **CV Analysis** - Get quality scores and improvement suggestions\n" +
                   "🎯 **Job Matching** - Find opportunities that fit your profile\n" +
                   "📝 **Cover Letters** - Generate personalized cover letters\n" +
                   "📌 **Application Tracking** - Keep track of your applications\n\n" +
                   "What would you like to do?",
          timestamp: new Date(),
        }],
        nextAction: WorkflowActions.WAIT_FOR_USER,
      };
    }

    const latestMessage = userMessages[userMessages.length - 1];
    const messageContent = latestMessage.content;
    const containsImages = hasImages(messageContent);
    const messageText = extractText(messageContent);

    // Prepare context for classification
    const context = {
      hasCVData: !!state.cvData,
      hasJobContext: !!state.targetJob,
      hasApplicationId: !!state.applicationId,
    };

    // Create classification prompt
    const prompt = createIntentPrompt(messageText, containsImages, context);

    // Get appropriate model (vision-capable if images present)
    const model = getModel(containsImages);

    // Build messages for LLM - support images if present
    const messages: (SystemMessage | HumanMessage)[] = [
      new SystemMessage(
        "You are an intent classification expert. Always respond with valid JSON matching the requested format." +
        (containsImages ? " When images are provided, analyze them carefully to understand the user's intent." : "")
      ),
    ];

    if (containsImages && Array.isArray(messageContent)) {
      // Include images in the message
      const imageItems = messageContent.filter((item): item is ImageContent => 
        typeof item === "object" && item !== null && "type" in item && item.type === "image_url"
      );
      // Build content array: text first, then images
      const contentArray: Array<string | ImageContent> = [prompt, ...imageItems];
      const langChainContent = convertToLangChainContent(contentArray);
      messages.push(new HumanMessage(langChainContent as any));
    } else {
      // Just text
      messages.push(new HumanMessage(prompt));
    }

    // Call LLM for intent classification
    console.log(`[Orchestrator] Calling ${containsImages ? "vision-capable" : "standard"} model for intent classification`);
    const response = await model.invoke(messages);

    const responseText = response.content.toString();
    console.log("[Orchestrator] Received classification from GPT-4");

    // Parse response
    let classificationData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      classificationData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[Orchestrator] JSON parsing failed:", parseError);
      // Fall back to general chat
      classificationData = {
        intent: "general_chat",
        confidence: 0.5,
        requiredData: [],
      };
    }

    // Validate with Zod
    const parseResult = safeParse(IntentClassificationSchema, classificationData);

    if (!parseResult.success) {
      console.error("[Orchestrator] Validation failed:", parseResult.error);
      // Fall back to general chat
      classificationData = {
        intent: "general_chat",
        confidence: 0.5,
        requiredData: [],
      };
    } else {
      classificationData = parseResult.data;
    }

    const { intent, confidence, requiredData } = classificationData;

    console.log(`[Orchestrator] Classified intent: ${intent} (confidence: ${confidence})`);

    // Check if required data is available
    if (requiredData && requiredData.length > 0) {
      const missingData = requiredData.filter(data => {
        if (data === "cv") return !state.cvData;
        if (data === "job") return !state.targetJob;
        return false;
      });

      if (missingData.length > 0) {
        return {
          currentIntent: intent,
          messages: [{
            role: "assistant",
            content: generateDataRequestMessage(intent, missingData),
            timestamp: new Date(),
          }],
          nextAction: WorkflowActions.WAIT_FOR_USER,
        };
      }
    }

    // Route based on intent
    let nextAction: string;
    switch (intent) {
      case "analyze_cv":
        nextAction = WorkflowActions.ANALYZE_CV;
        break;
      case "find_jobs":
        nextAction = WorkflowActions.FIND_JOBS;
        break;
      case "track_application":
        nextAction = WorkflowActions.TRACK_APPLICATION;
        break;
      case "enhance_cover_letter":
        nextAction = WorkflowActions.ENHANCE_LETTER;
        break;
      case "general_chat":
      default:
        nextAction = WorkflowActions.RESPOND_GENERAL;
        break;
    }

    // If general chat, respond directly
    if (nextAction === WorkflowActions.RESPOND_GENERAL) {
      const response = await handleGeneralChat(messageText, containsImages, messageContent, state);
      return {
        currentIntent: intent,
        messages: [{
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }],
        nextAction: WorkflowActions.WAIT_FOR_USER,
      };
    }

    // Otherwise, route to specialized agent
    return {
      currentIntent: intent,
      nextAction,
    };

  } catch (error) {
    console.error("[Orchestrator] Error during orchestration:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error in orchestrator",
      messages: [{
        role: "assistant",
        content: "I encountered an error understanding your request. Could you please rephrase that?",
        timestamp: new Date(),
      }],
      nextAction: WorkflowActions.WAIT_FOR_USER,
    };
  }
}

/**
 * Generate message requesting missing data
 */
function generateDataRequestMessage(intent: string, missingData: string[]): string {
  const dataMessages: Record<string, string> = {
    cv: "I need your CV to help with that. Please select or upload your CV first.",
    job: "I need details about the job you're interested in. Please provide the job title, company, and description.",
  };

  const messages = missingData.map(data => dataMessages[data] || "I need more information");

  return messages.join(" ");
}

/**
 * Handle general conversation
 */
async function handleGeneralChat(
  message: string, 
  hasImages: boolean, 
  messageContent: string | Array<string | ImageContent>,
  state: CareerServiceStateType
): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // If images are present, use vision model to analyze them
  if (hasImages) {
    const model = getModel(true);
    const visionPrompt = `The user has sent you ${Array.isArray(messageContent) 
      ? messageContent.filter(item => typeof item === "object" && "type" in item && item.type === "image_url").length 
      : 0} image(s)${message ? ` with the message: "${message}"` : ""}.

Analyze the image(s) and provide helpful information. The images might contain:
- CV/resume content
- Job postings
- Documents
- Screenshots
- Other career-related information

Provide a helpful response based on what you see in the image(s). If it's a CV, offer to help analyze it. If it's a job posting, offer to help with matching or cover letters. Be conversational and helpful.`;

    const messages: (SystemMessage | HumanMessage)[] = [
      new SystemMessage("You are a helpful AI career assistant. Analyze images carefully and provide useful insights."),
    ];

    if (Array.isArray(messageContent)) {
      const imageItems = messageContent.filter((item): item is ImageContent => 
        typeof item === "object" && item !== null && "type" in item && item.type === "image_url"
      );
      // Build content array: text first, then images
      const contentArray: Array<string | ImageContent> = [visionPrompt, ...imageItems];
      const langChainContent = convertToLangChainContent(contentArray);
      messages.push(new HumanMessage(langChainContent as any));
    } else {
      messages.push(new HumanMessage(visionPrompt));
    }

    try {
      const response = await model.invoke(messages);
      return response.content.toString();
    } catch (error) {
      console.error("[Orchestrator] Error processing images:", error);
      return "I can see you've shared an image, but I had trouble analyzing it. Could you describe what's in the image or try again?";
    }
  }

  // Handle common greetings and questions
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm your AI career assistant. I can help you with CV analysis, job matching, " +
           "cover letter writing, and application tracking. What would you like to do today?";
  }

  if (lowerMessage.includes("what can you do") || lowerMessage.includes("help")) {
    return "I can assist you with:\n\n" +
           "📊 **CV Analysis** - Evaluate your CV quality and ATS compatibility\n" +
           "🎯 **Job Matching** - Find jobs that match your skills and experience\n" +
           "📝 **Cover Letters** - Create tailored cover letters for specific jobs\n" +
           "📌 **Application Tracking** - Keep track of your job applications\n\n" +
           "Just tell me what you'd like to do!";
  }

  if (lowerMessage.includes("thank")) {
    return "You're welcome! Let me know if you need anything else.";
  }

  // For other general messages, provide guidance
  return "I'm here to help with your job search! You can ask me to:\n" +
         "- Analyze your CV\n" +
         "- Find matching jobs\n" +
         "- Write a cover letter\n" +
         "- Track an application\n\n" +
         "What would you like to do?";
}

export default orchestratorAgent;














