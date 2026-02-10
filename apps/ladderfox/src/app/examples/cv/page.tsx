import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'CV Guide & Advice | LadderFox',
  description: 'Get personalized CV advice based on your country, sector, and profession. Discover what recruiters are looking for and create a professional CV.',
  keywords: [
    'cv advice',
    'cv tips',
    'resume examples',
    'professional cv',
    'cv by profession',
    'cv samples',
    'curriculum vitae tips'
  ],
  openGraph: {
    title: 'CV Guide & Advice | LadderFox',
    description: 'Get personalized CV advice based on your country, sector, and profession.',
    type: 'website',
    locale: 'en_US'
  },
  alternates: {
    canonical: '/examples/cv'
  }
}

export default function CVAdvisorPageEN() {
  const language: Language = 'en'
  return <CVAdvisorPage type="cv" language={language} />
}
