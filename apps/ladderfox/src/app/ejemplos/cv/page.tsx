import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Guía de CV y Consejos | LadderFox',
  description: 'Obtén consejos personalizados para tu CV según tu país, sector y profesión. Descubre lo que buscan los reclutadores.',
  keywords: [
    'consejos cv',
    'cv ejemplos',
    'cv profesional',
    'curriculum vitae consejos',
    'cv por profesión'
  ],
  openGraph: {
    title: 'Guía de CV y Consejos | LadderFox',
    description: 'Obtén consejos personalizados para tu CV según tu país, sector y profesión.',
    type: 'website',
    locale: 'es_ES'
  },
  alternates: {
    canonical: '/ejemplos/cv'
  }
}

export default function SpanishCVAdvisorPage() {
  const language: Language = 'es'
  return <CVAdvisorPage type="cv" language={language} />
}
