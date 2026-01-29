import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamplePage from '@/components/examples/ExamplePage'
import { getProfession, getProfessionIdFromSlug, PROFESSIONS } from '@/data/professions'
import type { Language } from '@/data/professions'

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
      description: 'Het gevraagde motivatiebrief voorbeeld kon niet worden gevonden.'
    }
  }
  
  return {
    title: `${profession.name} Motivatiebrief Voorbeeld | LadderFox`,
    description: profession.description,
    keywords: [
      `motivatiebrief voorbeeld ${profession.name.toLowerCase()}`,
      `${profession.name.toLowerCase()} motivatiebrief`,
      'motivatiebrief template',
      'professionele motivatiebrief',
      'motivatiebrief maken'
    ],
    openGraph: {
      title: `${profession.name} Motivatiebrief Voorbeeld`,
      description: profession.description,
      type: 'website',
      locale: 'nl_NL'
    },
    alternates: {
      canonical: `/voorbeeld/motivatiebrief/${params.profession}`
    }
  }
}

export async function generateStaticParams() {
  const language: Language = 'nl'
  
  return PROFESSIONS.map((prof) => {
    const translation = prof.translations[language] || prof.translations.en
    return {
      profession: translation.slug
    }
  })
}

export default function DutchLetterExamplePage({ params }: PageProps) {
  const language: Language = 'nl'
  const professionId = getProfessionIdFromSlug(params.profession, language)
  
  if (!professionId) {
    notFound()
  }
  
  return <ExamplePage professionId={professionId} type="letter" language={language} />
}
