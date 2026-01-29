import { Metadata } from 'next'
import ExamplesOverviewPage from '@/components/examples/ExamplesOverviewPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Motivational Letter Examples by Profession | LadderFox',
  description: 'Browse professional motivational letter examples by profession. Learn what makes a great cover letter and get inspired to create your own.',
  keywords: [
    'cover letter examples',
    'motivational letter examples',
    'cover letter template',
    'professional cover letter',
    'letter by profession',
    'application letter examples'
  ],
  openGraph: {
    title: 'Motivational Letter Examples by Profession | LadderFox',
    description: 'Browse professional motivational letter examples by profession. Learn what makes a great cover letter.',
    type: 'website',
    locale: 'en_US'
  },
  alternates: {
    canonical: '/examples/letter'
  }
}

export default function LetterExamplesOverviewPage() {
  const language: Language = 'en'
  return <ExamplesOverviewPage type="letter" language={language} />
}
