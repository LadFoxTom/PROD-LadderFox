import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamplePage from '@/components/examples/ExamplePage'
import { getProfession, getProfessionIdFromSlug, PROFESSIONS } from '@/data/professions'
import type { Language } from '@/data/professions'

// Force dynamic rendering to speed up build time
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    profession: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language: Language = 'de'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  const profession = professionId ? getProfession(professionId, language) : null
  
  if (!profession) {
    return {
      title: 'Beispiel nicht gefunden',
      description: 'Das angeforderte Lebenslauf-Beispiel konnte nicht gefunden werden.'
    }
  }
  
  return {
    title: `${profession.name} Lebenslauf Beispiel | LadderFox`,
    description: profession.description,
    keywords: [
      `lebenslauf ${profession.name.toLowerCase()}`,
      `${profession.name.toLowerCase()} cv`,
      'lebenslauf vorlage',
      'professioneller lebenslauf',
      'lebenslauf erstellen'
    ],
    openGraph: {
      title: `${profession.name} Lebenslauf Beispiel`,
      description: profession.description,
      type: 'website',
      locale: 'de_DE'
    },
    alternates: {
      canonical: `/beispiele/lebenslauf/${params.profession}`
    }
  }
}

// Removed generateStaticParams to use dynamic rendering instead
// This prevents generating 33+ static pages during build, reducing build time from 20+ minutes to ~2-3 minutes
// export async function generateStaticParams() {
//   const language: Language = 'de'
//   
//   return PROFESSIONS.map((prof) => {
//     const translation = prof.translations[language] || prof.translations.en
//     return {
//       profession: translation.slug
//     }
//   })
// }

export default function GermanCVExamplePage({ params }: PageProps) {
  const language: Language = 'de'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="cv" language={language} />
}
