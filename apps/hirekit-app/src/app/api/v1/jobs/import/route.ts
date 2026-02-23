import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCompanyForUser } from '@/lib/company';
import { ChatOpenAI } from '@langchain/openai';

const VALID_WORKPLACE_TYPES = ['on-site', 'hybrid', 'remote'];
const VALID_EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
const VALID_EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead', 'director', 'executive'];
const VALID_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];
const VALID_SALARY_PERIODS = ['year', 'month', 'hour'];

const MAX_TEXT_LENGTH = 12000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    pdfParse = (await import('pdf-parse')).default;
  }
  return pdfParse;
}

function buildPrompt(text: string): string {
  return `You are an expert HR data extractor. Given the following job listing text, extract structured data and return a JSON object.

Job listing text:
---
${text}
---

Return a JSON object with these fields (use empty string or empty array if not found):
- "title": string — the job title
- "description": string — the job description / about the role. Format as HTML with <h3>, <p>, <ul>/<li> tags.
- "requirements": string — qualifications and requirements. Format as HTML with <ul>/<li> tags.
- "benefits": string — benefits and perks. Format as HTML with <ul>/<li> tags.
- "benefitTags": string[] — short benefit keywords like "Remote Work", "Health Insurance", "Flexible Hours", "401(k) / Pension", "Stock Options", "Unlimited PTO", "Learning Budget", "Gym Membership", "Parental Leave", "Home Office Stipend"
- "city": string — city name
- "region": string — state/region
- "country": string — country name
- "workplaceType": one of "on-site", "hybrid", "remote" or ""
- "employmentTypes": string[] — array of: "full-time", "part-time", "contract", "internship", "freelance"
- "experienceLevel": one of "entry", "mid", "senior", "lead", "director", "executive" or ""
- "department": string — department name (e.g. "Engineering", "Marketing")
- "salaryMin": string — minimum salary as a number string, or ""
- "salaryMax": string — maximum salary as a number string, or ""
- "salaryCurrency": one of "EUR", "USD", "GBP", "CHF" or "EUR" as default
- "salaryPeriod": one of "year", "month", "hour" or "year" as default

Return ONLY valid JSON, no markdown code fences, no explanation.`;
}

function normalizeOutput(raw: Record<string, any>): Record<string, any> {
  return {
    title: typeof raw.title === 'string' ? raw.title.trim() : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    requirements: typeof raw.requirements === 'string' ? raw.requirements : '',
    benefits: typeof raw.benefits === 'string' ? raw.benefits : '',
    benefitTags: Array.isArray(raw.benefitTags)
      ? raw.benefitTags.filter((t: any) => typeof t === 'string')
      : [],
    city: typeof raw.city === 'string' ? raw.city.trim() : '',
    region: typeof raw.region === 'string' ? raw.region.trim() : '',
    country: typeof raw.country === 'string' ? raw.country.trim() : '',
    workplaceType: VALID_WORKPLACE_TYPES.includes(raw.workplaceType) ? raw.workplaceType : '',
    employmentTypes: Array.isArray(raw.employmentTypes)
      ? raw.employmentTypes.filter((t: any) => VALID_EMPLOYMENT_TYPES.includes(t))
      : [],
    experienceLevel: VALID_EXPERIENCE_LEVELS.includes(raw.experienceLevel) ? raw.experienceLevel : '',
    department: typeof raw.department === 'string' ? raw.department.trim() : '',
    salaryMin: typeof raw.salaryMin === 'string' ? raw.salaryMin : String(raw.salaryMin || ''),
    salaryMax: typeof raw.salaryMax === 'string' ? raw.salaryMax : String(raw.salaryMax || ''),
    salaryCurrency: VALID_CURRENCIES.includes(raw.salaryCurrency) ? raw.salaryCurrency : 'EUR',
    salaryPeriod: VALID_SALARY_PERIODS.includes(raw.salaryPeriod) ? raw.salaryPeriod : 'year',
  };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  let text = '';
  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();

      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdf = await getPdfParser();
        const data = await pdf(buffer);
        text = data.text || '';
      } else if (
        file.type === 'text/plain' ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.md')
      ) {
        text = await file.text();
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or TXT file.' },
          { status: 400 }
        );
      }
    } else {
      const body = await request.json();
      text = typeof body.text === 'string' ? body.text : '';
    }

    text = text.trim();
    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: 'Please provide more text to extract job data from.' },
        { status: 400 }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      text = text.substring(0, MAX_TEXT_LENGTH);
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke(buildPrompt(text));
    const raw = typeof response.content === 'string' ? response.content : '';

    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const jobData = normalizeOutput(parsed);

    if (!jobData.title) {
      return NextResponse.json(
        { error: 'Could not extract a job title. Please check that the text contains a job listing.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ jobData });
  } catch (error: any) {
    console.error('[Job Import] Error:', error);
    return NextResponse.json(
      { error: 'Failed to extract job data. Please check the content and try again.' },
      { status: 500 }
    );
  }
}
