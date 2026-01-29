import { Metadata } from 'next'
import ExamplesOverviewPage from '@/components/examples/ExamplesOverviewPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'CV Voorbeelden per Beroep | LadderFox',
  description: 'Bekijk professionele CV voorbeelden per beroep. Leer wat een goed CV maakt en laat je inspireren om je eigen professionele CV te maken.',
  keywords: [
    'cv voorbeelden',
    'cv voorbeeld',
    'cv template',
    'professioneel cv',
    'cv per beroep',
    'cv voorbeelden nederland',
    'curriculum vitae voorbeelden'
  ],
  openGraph: {
    title: 'CV Voorbeelden per Beroep | LadderFox',
    description: 'Bekijk professionele CV voorbeelden per beroep. Leer wat een goed CV maakt en laat je inspireren.',
    type: 'website',
    locale: 'nl_NL'
  },
  alternates: {
    canonical: '/voorbeeld/cv'
  }
}

export default function DutchCVExamplesOverviewPage() {
  const language: Language = 'nl'
  return <ExamplesOverviewPage type="cv" language={language} />
}
