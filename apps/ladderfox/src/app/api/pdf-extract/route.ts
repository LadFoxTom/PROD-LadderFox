import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CV Data structure for extraction
interface ExtractedCVData {
  fullName?: string
  title?: string
  summary?: string
  contact?: {
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    website?: string
  }
  experience?: Array<{
    title: string
    company: string
    location?: string
    dates: string
    content: string[]
  }>
  education?: Array<{
    degree: string
    institution: string
    field?: string
    dates: string
    content?: string[]
  }>
  skills?: {
    technical?: string[]
    soft?: string[]
    languages?: string[]
    tools?: string[]
  }
  certifications?: Array<{
    name: string
    issuer?: string
    date?: string
  }>
  languages?: Array<{
    language: string
    level: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies?: string[]
    link?: string
  }>
  interests?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { pdfText } = await request.json()

    if (!pdfText) {
      return NextResponse.json(
        { error: 'PDF text content is required' },
        { status: 400 }
      )
    }

    console.log('[PDF Extract] Processing text, length:', pdfText.length)

    // Use OpenAI to extract structured CV data
    const extractedData = await extractCVDataWithAI(pdfText)

    console.log('[PDF Extract] Extracted data:', JSON.stringify(extractedData, null, 2).substring(0, 500))

    return NextResponse.json({
      success: true,
      extractedData,
      message: 'CV data extracted successfully'
    })

  } catch (error) {
    console.error('[PDF Extract] Error:', error)
    return NextResponse.json(
      { error: 'Failed to extract PDF data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function extractCVDataWithAI(pdfText: string): Promise<ExtractedCVData> {
  const systemPrompt = `You are an expert CV/Resume parser. Your task is to extract structured information from CV text.

Extract all available information and return it as a JSON object with the following structure:
{
  "fullName": "Full name of the person",
  "title": "Professional title/headline (e.g., 'Senior Software Engineer')",
  "summary": "Professional summary or objective statement",
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "LinkedIn URL or username",
    "website": "Personal website URL"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "dates": "Start Date - End Date (e.g., 'Jan 2020 - Present')",
      "content": ["Achievement or responsibility 1", "Achievement or responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree name (e.g., 'Bachelor of Science')",
      "institution": "University/School name",
      "field": "Field of study",
      "dates": "Start - End (e.g., '2015 - 2019')",
      "content": ["Notable achievements, honors, GPA, etc."]
    }
  ],
  "skills": {
    "technical": ["Programming languages, frameworks, databases, technologies - extract ALL mentioned skills"],
    "soft": ["Communication, leadership, teamwork, problem-solving, etc."],
    "languages": ["Programming languages if listed in skills section"],
    "tools": ["Software, applications, platforms, methodologies (e.g., Agile, Scrum, Git, Docker)"]
  },
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "Date obtained"
    }
  ],
  "languages": [
    {
      "language": "Language name",
      "level": "Proficiency level (e.g., Native, Fluent, Intermediate)"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "technologies": ["Tech used"],
      "link": "URL if available"
    }
  ],
  "interests": ["Hobbies, interests, or personal activities mentioned"]
}

Rules:
1. Extract ONLY information that is explicitly present in the text
2. Do not make up or infer information that isn't there
3. For experience and education, extract ALL items mentioned, ordered from most recent to oldest
4. For skills, categorize them appropriately based on context
5. Keep dates in the original format found in the CV
6. For achievements/responsibilities, preserve the original wording but clean up formatting
7. If a section is not present, omit it from the response (return empty array or omit field)
8. Always return valid JSON`

  const userPrompt = `Extract all CV/Resume information from the following text and return it as a structured JSON object:

---
${pdfText}
---

Return ONLY the JSON object, no additional text or explanation.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      console.error('[PDF Extract] No content in AI response')
      return fallbackExtraction(pdfText)
    }

    try {
      const parsed = JSON.parse(content)
      return normalizeExtractedData(parsed)
    } catch (parseError) {
      console.error('[PDF Extract] Failed to parse AI response:', parseError)
      return fallbackExtraction(pdfText)
    }
  } catch (aiError) {
    console.error('[PDF Extract] AI extraction failed:', aiError)
    return fallbackExtraction(pdfText)
  }
}

// Normalize the extracted data to ensure consistent structure
function normalizeExtractedData(data: any): ExtractedCVData {
  const normalized: ExtractedCVData = {}

  if (data.fullName) normalized.fullName = data.fullName.trim()
  if (data.title) normalized.title = data.title.trim()
  if (data.summary) normalized.summary = data.summary.trim()

  // Normalize contact
  if (data.contact && typeof data.contact === 'object') {
    normalized.contact = {}
    if (data.contact.email) normalized.contact.email = data.contact.email.trim()
    if (data.contact.phone) normalized.contact.phone = data.contact.phone.trim()
    if (data.contact.location) normalized.contact.location = data.contact.location.trim()
    if (data.contact.linkedin) normalized.contact.linkedin = data.contact.linkedin.trim()
    if (data.contact.website) normalized.contact.website = data.contact.website.trim()
  }

  // Normalize experience
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    normalized.experience = data.experience.map((exp: any) => ({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      dates: exp.dates || '',
      content: Array.isArray(exp.content) ? exp.content :
               (exp.achievements ? exp.achievements :
               (exp.description ? [exp.description] : []))
    })).filter((exp: any) => exp.title || exp.company)
  }

  // Normalize education
  if (Array.isArray(data.education) && data.education.length > 0) {
    normalized.education = data.education.map((edu: any) => ({
      degree: edu.degree || '',
      institution: edu.institution || edu.school || edu.university || '',
      field: edu.field || edu.major || '',
      dates: edu.dates || edu.year || '',
      content: Array.isArray(edu.content) ? edu.content : []
    })).filter((edu: any) => edu.degree || edu.institution)
  }

  // Normalize skills
  if (data.skills) {
    normalized.skills = {}
    if (Array.isArray(data.skills)) {
      // If skills is just an array, put all in technical
      normalized.skills.technical = data.skills
    } else if (typeof data.skills === 'object') {
      if (Array.isArray(data.skills.technical)) normalized.skills.technical = data.skills.technical
      if (Array.isArray(data.skills.soft)) normalized.skills.soft = data.skills.soft
      if (Array.isArray(data.skills.languages)) normalized.skills.languages = data.skills.languages
      if (Array.isArray(data.skills.tools)) normalized.skills.tools = data.skills.tools
    }
  }

  // Normalize certifications
  if (Array.isArray(data.certifications) && data.certifications.length > 0) {
    normalized.certifications = data.certifications.map((cert: any) => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || ''
    })).filter((cert: any) => cert.name)
  }

  // Normalize languages
  if (Array.isArray(data.languages) && data.languages.length > 0) {
    normalized.languages = data.languages.map((lang: any) => ({
      language: lang.language || lang.name || '',
      level: lang.level || lang.proficiency || ''
    })).filter((lang: any) => lang.language)
  }

  // Normalize projects
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    normalized.projects = data.projects.map((proj: any) => ({
      name: proj.name || proj.title || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      link: proj.link || proj.url || ''
    })).filter((proj: any) => proj.name)
  }

  // Normalize interests
  if (Array.isArray(data.interests) && data.interests.length > 0) {
    normalized.interests = data.interests.filter((i: any) => typeof i === 'string' && i.trim())
  } else if (typeof data.interests === 'string' && data.interests.trim()) {
    // If it's a single string, split by comma
    normalized.interests = data.interests.split(',').map((i: string) => i.trim()).filter(Boolean)
  }

  return normalized
}

// Fallback extraction using regex (backup if AI fails)
function fallbackExtraction(pdfText: string): ExtractedCVData {
  console.log('[PDF Extract] Using fallback regex extraction')

  const extractedData: ExtractedCVData = {}

  // Extract email
  const emailMatch = pdfText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) {
    extractedData.contact = { ...extractedData.contact, email: emailMatch[0] }
  }

  // Extract phone number
  const phoneMatch = pdfText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}/)
  if (phoneMatch) {
    extractedData.contact = { ...extractedData.contact, phone: phoneMatch[0] }
  }

  // Try to extract name from the beginning of the text (often the first line)
  const lines = pdfText.split('\n').filter(line => line.trim().length > 0)
  if (lines.length > 0) {
    const firstLine = lines[0].trim()
    // If first line looks like a name (2-4 words, all capitalized or title case)
    if (firstLine.length < 50 && /^[A-Z][a-zA-Z]+([ \-][A-Z][a-zA-Z]+){0,3}$/.test(firstLine)) {
      extractedData.fullName = firstLine
    }
  }

  // Look for LinkedIn
  const linkedinMatch = pdfText.match(/linkedin\.com\/in\/[\w-]+/)
  if (linkedinMatch) {
    extractedData.contact = { ...extractedData.contact, linkedin: 'https://' + linkedinMatch[0] }
  }

  return extractedData
}
