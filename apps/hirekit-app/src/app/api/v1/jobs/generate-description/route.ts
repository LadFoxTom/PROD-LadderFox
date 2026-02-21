import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { ChatOpenAI } from '@langchain/openai';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    include: { branding: true },
  });
  if (!company) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { title, bullets, tone, department } = body;

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const prompt = `You are a professional HR content writer. Generate job listing content for the following role.

Company: ${company.name}
${company.branding?.tagline ? `Company tagline: ${company.branding.tagline}` : ''}
Job Title: ${title}
${department ? `Department: ${department}` : ''}
${tone ? `Tone: ${tone}` : 'Tone: Professional and welcoming'}
${bullets ? `Key points to include:\n${bullets}` : ''}

Return a JSON object with exactly three fields:
1. "description" — About the role and responsibilities. Use HTML tags: <h3> for section headers, <p> for paragraphs, <ul>/<li> for bullet lists. Include an "About the Role" paragraph and a "Responsibilities" section with 5-7 bullet points.
2. "requirements" — Required qualifications. Use HTML: <ul>/<li> for 5-7 requirements, plus a <h3>Nice to Have</h3> section with 3-4 items.
3. "benefits" — What the company offers. Use HTML: <ul>/<li> for 3-5 benefits/perks.

Return ONLY valid JSON, no markdown code fences.`;

  try {
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke(prompt);
    const raw = typeof response.content === 'string' ? response.content : '';

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
      return NextResponse.json({
        description: parsed.description || '',
        requirements: parsed.requirements || '',
        benefits: parsed.benefits || '',
      });
    } catch {
      // Fallback: return as single description field
      return NextResponse.json({ description: raw });
    }
  } catch (error: any) {
    console.error('AI description generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 }
    );
  }
}
