import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Motivatiebrief Gids & Advies | LadderFox',
  description: 'Krijg gepersonaliseerd advies voor je motivatiebrief op basis van je land, sector en beroep. Ontdek wat recruiters zoeken.',
  keywords: [
    'motivatiebrief advies',
    'motivatiebrief tips',
    'sollicitatiebrief voorbeeld',
    'professionele motivatiebrief',
    'brief per beroep',
    'motivatiebrief nederland'
  ],
  openGraph: {
    title: 'Motivatiebrief Gids & Advies | LadderFox',
    description: 'Krijg gepersonaliseerd advies voor je motivatiebrief op basis van je land, sector en beroep.',
    type: 'website',
    locale: 'nl_NL'
  },
  alternates: {
    canonical: '/voorbeeld/motivatiebrief'
  }
}

export default function DutchLetterAdvisorPage() {
  const language: Language = 'nl'
  return <CVAdvisorPage type="letter" language={language} />
}
