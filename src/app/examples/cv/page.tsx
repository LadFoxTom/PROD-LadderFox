import { Metadata } from 'next'
import ExamplesOverviewPage from '@/components/examples/ExamplesOverviewPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'CV Examples by Profession | LadderFox',
  description: 'Browse professional CV examples by profession. Learn what makes a great CV and get inspired to create your own professional resume.',
  keywords: [
    'cv examples',
    'resume examples',
    'cv template',
    'professional cv',
    'cv by profession',
    'cv samples',
    'curriculum vitae examples'
  ],
  openGraph: {
    title: 'CV Examples by Profession | LadderFox',
    description: 'Browse professional CV examples by profession. Learn what makes a great CV and get inspired.',
    type: 'website',
    locale: 'en_US'
  },
  alternates: {
    canonical: '/examples/cv'
  }
}

export default function CVExamplesOverviewPage() {
  const language: Language = 'en'
  return <ExamplesOverviewPage type="cv" language={language} />
}
