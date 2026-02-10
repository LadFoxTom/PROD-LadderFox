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
      description: 'Das angeforderte Anschreiben-Beispiel konnte nicht gefunden werden.'
    }
  }
  
  return {
    title: `${profession.name} Anschreiben Beispiel | LadderFox`,
    description: profession.description,
    keywords: [
      `anschreiben ${profession.name.toLowerCase()}`,
      `bewerbungsschreiben ${profession.name.toLowerCase()}`,
      'anschreiben vorlage',
      'professionelles anschreiben'
    ],
    openGraph: {
      title: `${profession.name} Anschreiben Beispiel`,
      description: profession.description,
      type: 'website',
      locale: 'de_DE'
    },
    alternates: {
      canonical: `/beispiele/anschreiben/${params.profession}`
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

export default function GermanLetterExamplePage({ params }: PageProps) {
  const language: Language = 'de'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="letter" language={language} />
}
