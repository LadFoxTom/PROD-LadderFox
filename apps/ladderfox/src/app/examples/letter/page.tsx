import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Cover Letter Guide & Advice | LadderFox',
  description: 'Get personalized cover letter advice based on your country, sector, and profession. Discover what recruiters are looking for.',
  keywords: [
    'cover letter advice',
    'cover letter tips',
    'cover letter template',
    'professional cover letter',
    'letter by profession',
    'application letter tips'
  ],
  openGraph: {
    title: 'Cover Letter Guide & Advice | LadderFox',
    description: 'Get personalized cover letter advice based on your country, sector, and profession.',
    type: 'website',
    locale: 'en_US'
  },
  alternates: {
    canonical: '/examples/letter'
  }
}

export default function LetterAdvisorPageEN() {
  const language: Language = 'en'
  return <CVAdvisorPage type="letter" language={language} />
}
