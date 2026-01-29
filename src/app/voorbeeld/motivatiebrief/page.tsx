import { Metadata } from 'next'
import ExamplesOverviewPage from '@/components/examples/ExamplesOverviewPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Motivatiebrief Voorbeelden per Beroep | LadderFox',
  description: 'Bekijk professionele motivatiebrief voorbeelden per beroep. Leer wat een goede motivatiebrief maakt en laat je inspireren om je eigen brief te maken.',
  keywords: [
    'motivatiebrief voorbeelden',
    'motivatiebrief voorbeeld',
    'sollicitatiebrief voorbeelden',
    'professionele motivatiebrief',
    'brief per beroep',
    'motivatiebrief nederland'
  ],
  openGraph: {
    title: 'Motivatiebrief Voorbeelden per Beroep | LadderFox',
    description: 'Bekijk professionele motivatiebrief voorbeelden per beroep. Leer wat een goede motivatiebrief maakt.',
    type: 'website',
    locale: 'nl_NL'
  },
  alternates: {
    canonical: '/voorbeeld/motivatiebrief'
  }
}

export default function DutchLetterExamplesOverviewPage() {
  const language: Language = 'nl'
  return <ExamplesOverviewPage type="letter" language={language} />
}
