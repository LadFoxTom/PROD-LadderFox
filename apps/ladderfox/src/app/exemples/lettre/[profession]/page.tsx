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
  const language: Language = 'fr'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  const profession = professionId ? getProfession(professionId, language) : null
  
  if (!profession) {
    return {
      title: 'Exemple introuvable',
      description: 'L\'exemple de lettre de motivation demandé est introuvable.'
    }
  }
  
  return {
    title: `Exemple Lettre de Motivation ${profession.name} | LadderFox`,
    description: profession.description,
    keywords: [
      `lettre motivation ${profession.name.toLowerCase()}`,
      `exemple lettre ${profession.name.toLowerCase()}`,
      'modèle lettre motivation',
      'lettre professionnelle'
    ],
    openGraph: {
      title: `Exemple Lettre de Motivation ${profession.name}`,
      description: profession.description,
      type: 'website',
      locale: 'fr_FR'
    },
    alternates: {
      canonical: `/exemples/lettre/${params.profession}`
    }
  }
}

// Removed generateStaticParams to use dynamic rendering instead
// This prevents generating 33+ static pages during build, reducing build time from 20+ minutes to ~2-3 minutes
// export async function generateStaticParams() {
//   const language: Language = 'fr'
//   
//   return PROFESSIONS.map((prof) => {
//     const translation = prof.translations[language] || prof.translations.en
//     return {
//       profession: translation.slug
//     }
//   })
// }

export default function FrenchLetterExamplePage({ params }: PageProps) {
  const language: Language = 'fr'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="letter" language={language} />
}
