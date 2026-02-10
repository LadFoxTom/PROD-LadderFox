import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Guía de Carta de Presentación | LadderFox',
  description: 'Obtén consejos personalizados para tu carta de presentación según tu país, sector y profesión. Descubre lo que buscan los reclutadores.',
  keywords: [
    'carta de presentación consejos',
    'carta de motivación ejemplos',
    'carta profesional',
    'carta por profesión'
  ],
  openGraph: {
    title: 'Guía de Carta de Presentación | LadderFox',
    description: 'Obtén consejos personalizados para tu carta de presentación según tu país, sector y profesión.',
    type: 'website',
    locale: 'es_ES'
  },
  alternates: {
    canonical: '/ejemplos/carta'
  }
}

export default function SpanishLetterAdvisorPage() {
  const language: Language = 'es'
  return <CVAdvisorPage type="letter" language={language} />
}
