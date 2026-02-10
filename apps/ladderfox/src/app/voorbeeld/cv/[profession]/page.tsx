import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamplePage from '@/components/examples/ExamplePage'
import { getProfession, getProfessionIdFromSlug, URL_SEGMENTS, PROFESSIONS } from '@/data/professions'
import type { Language } from '@/data/professions'

// Force dynamic rendering to speed up build time
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    profession: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language: Language = 'nl'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  const profession = professionId ? getProfession(professionId, language) : null
  
  if (!profession) {
    return {
      title: 'Voorbeeld niet gevonden',
      description: 'Het gevraagde CV voorbeeld kon niet worden gevonden.'
    }
  }
  
  return {
    title: `${profession.name} CV Voorbeeld | LadderFox`,
    description: profession.description,
    keywords: [
      `cv voorbeeld ${profession.name.toLowerCase()}`,
      `${profession.name.toLowerCase()} cv`,
      'cv template',
      'professioneel cv',
      'cv maken',
      'cv voorbeeld nederland'
    ],
    openGraph: {
      title: `${profession.name} CV Voorbeeld`,
      description: profession.description,
      type: 'website',
      locale: 'nl_NL'
    },
    alternates: {
      canonical: `/voorbeeld/cv/${params.profession}`
    }
  }
}

// Removed generateStaticParams to use dynamic rendering instead
// This prevents generating 33+ static pages during build, reducing build time from 20+ minutes to ~2-3 minutes
// export async function generateStaticParams() {
//   // Generate static params for all professions in Dutch
//   const language: Language = 'nl'
//   
//   return PROFESSIONS.map((prof) => {
//     const translation = prof.translations[language] || prof.translations.en
//     return {
//       profession: translation.slug
//     }
//   })
// }

export default function DutchCVExamplePage({ params }: PageProps) {
  const language: Language = 'nl'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="cv" language={language} />
}
