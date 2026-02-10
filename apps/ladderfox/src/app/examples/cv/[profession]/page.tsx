import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamplePage from '@/components/examples/ExamplePage'
import { getProfession, getProfessionIdFromSlug, PROFESSIONS, URL_SEGMENTS } from '@/data/professions'
import type { Language } from '@/data/professions'

// Force dynamic rendering to speed up build time
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    profession: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language: Language = 'en'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  const profession = professionId ? getProfession(professionId, language) : null
  
  if (!profession) {
    return {
      title: 'Example Not Found',
      description: 'The requested CV example could not be found.'
    }
  }
  
  return {
    title: `${profession.name} CV Example | LadderFox`,
    description: profession.description,
    keywords: [
      `${profession.name.toLowerCase()} cv example`,
      `${profession.name.toLowerCase()} resume`,
      'cv template',
      'professional cv',
      'cv builder',
      'resume example'
    ],
    openGraph: {
      title: `${profession.name} CV Example`,
      description: profession.description,
      type: 'website',
      locale: 'en_US'
    },
    alternates: {
      canonical: `/examples/cv/${params.profession}`
    }
  }
}

// Removed generateStaticParams to use dynamic rendering instead
// This prevents generating 33+ static pages during build, reducing build time from 20+ minutes to ~2-3 minutes
// export async function generateStaticParams() {
//   const language: Language = 'en'
//   
//   return PROFESSIONS.map((prof) => {
//     const translation = prof.translations[language] || prof.translations.en
//     return {
//       profession: translation.slug
//     }
//   })
// }

export default function EnglishCVExamplePage({ params }: PageProps) {
  const language: Language = 'en'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="cv" language={language} />
}
