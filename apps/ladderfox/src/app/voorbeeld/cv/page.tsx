import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'CV Gids & Advies | LadderFox',
  description: 'Krijg gepersonaliseerd CV advies op basis van je land, sector en beroep. Ontdek wat recruiters zoeken en maak een professioneel CV.',
  keywords: [
    'cv advies',
    'cv tips',
    'cv voorbeeld',
    'professioneel cv',
    'cv per beroep',
    'cv nederland',
    'curriculum vitae tips'
  ],
  openGraph: {
    title: 'CV Gids & Advies | LadderFox',
    description: 'Krijg gepersonaliseerd CV advies op basis van je land, sector en beroep.',
    type: 'website',
    locale: 'nl_NL'
  },
  alternates: {
    canonical: '/voorbeeld/cv'
  }
}

export default function DutchCVAdvisorPage() {
  const language: Language = 'nl'
  return <CVAdvisorPage type="cv" language={language} />
}
