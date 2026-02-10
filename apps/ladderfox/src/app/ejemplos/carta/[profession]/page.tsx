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
  const language: Language = 'es'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  const profession = professionId ? getProfession(professionId, language) : null
  
  if (!profession) {
    return {
      title: 'Ejemplo no encontrado',
      description: 'El ejemplo de carta de presentación solicitado no se pudo encontrar.'
    }
  }
  
  return {
    title: `Ejemplo Carta de Presentación ${profession.name} | LadderFox`,
    description: profession.description,
    keywords: [
      `carta presentación ${profession.name.toLowerCase()}`,
      `ejemplo carta ${profession.name.toLowerCase()}`,
      'plantilla carta presentación',
      'carta profesional'
    ],
    openGraph: {
      title: `Ejemplo Carta de Presentación ${profession.name}`,
      description: profession.description,
      type: 'website',
      locale: 'es_ES'
    },
    alternates: {
      canonical: `/ejemplos/carta/${params.profession}`
    }
  }
}

// Removed generateStaticParams to use dynamic rendering instead
// This prevents generating 33+ static pages during build, reducing build time from 20+ minutes to ~2-3 minutes
// export async function generateStaticParams() {
//   const language: Language = 'es'
//   
//   return PROFESSIONS.map((prof) => {
//     const translation = prof.translations[language] || prof.translations.en
//     return {
//       profession: translation.slug
//     }
//   })
// }

export default function SpanishLetterExamplePage({ params }: PageProps) {
  const language: Language = 'es'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="letter" language={language} />
}
