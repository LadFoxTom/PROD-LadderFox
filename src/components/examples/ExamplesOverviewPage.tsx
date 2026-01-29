'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import { getProfessionsByCategory, URL_SEGMENTS, type Language } from '@/data/professions'
import { FaFileAlt, FaArrowRight, FaBriefcase, FaUser, FaCheckCircle } from 'react-icons/fa'

interface ExamplesOverviewPageProps {
  type: 'cv' | 'letter'
  language: Language
}

export default function ExamplesOverviewPage({ type, language }: ExamplesOverviewPageProps) {
  const { t } = useLocale()
  const segments = URL_SEGMENTS[language]
  const professionsByCategory = getProfessionsByCategory(language)
  
  const typeName = type === 'cv' 
    ? (t('examples.cv') || 'CV')
    : (t('examples.letter') || 'Motivational Letter')
  
  const typeSegment = type === 'cv' ? segments.cv : segments.letter
  
  // Category names in different languages
  const categoryNames: Record<string, Record<Language, string>> = {
    healthcare: {
      en: 'Healthcare',
      nl: 'Zorg & Gezondheid',
      fr: 'Santé',
      es: 'Salud',
      de: 'Gesundheitswesen',
      it: 'Sanità',
      pl: 'Opieka Zdrowotna',
      ro: 'Sănătate',
      hu: 'Egészségügy',
      el: 'Υγεία',
      cs: 'Zdravotnictví',
      pt: 'Saúde',
      sv: 'Hälsovård',
      bg: 'Здравеопазване',
      da: 'Sundhedspleje',
      fi: 'Terveydenhuolto',
      sk: 'Zdravotníctvo',
      no: 'Helsevesen',
      hr: 'Zdravstvo',
      sr: 'Здравство'
    },
    technology: {
      en: 'Technology',
      nl: 'Technologie',
      fr: 'Technologie',
      es: 'Tecnología',
      de: 'Technologie',
      it: 'Tecnologia',
      pl: 'Technologia',
      ro: 'Tehnologie',
      hu: 'Technológia',
      el: 'Τεχνολογία',
      cs: 'Technologie',
      pt: 'Tecnologia',
      sv: 'Teknik',
      bg: 'Технологии',
      da: 'Teknologi',
      fi: 'Teknologia',
      sk: 'Technológia',
      no: 'Teknologi',
      hr: 'Tehnologija',
      sr: 'Технологија'
    },
    education: {
      en: 'Education',
      nl: 'Onderwijs',
      fr: 'Éducation',
      es: 'Educación',
      de: 'Bildung',
      it: 'Educazione',
      pl: 'Edukacja',
      ro: 'Educație',
      hu: 'Oktatás',
      el: 'Εκπαίδευση',
      cs: 'Vzdělávání',
      pt: 'Educação',
      sv: 'Utbildning',
      bg: 'Образование',
      da: 'Uddannelse',
      fi: 'Koulutus',
      sk: 'Vzdelávanie',
      no: 'Utdanning',
      hr: 'Obrazovanje',
      sr: 'Образовање'
    },
    business: {
      en: 'Business',
      nl: 'Zakelijk',
      fr: 'Commerce',
      es: 'Negocios',
      de: 'Wirtschaft',
      it: 'Business',
      pl: 'Biznes',
      ro: 'Afaceri',
      hu: 'Üzlet',
      el: 'Επιχειρήσεις',
      cs: 'Podnikání',
      pt: 'Negócios',
      sv: 'Företag',
      bg: 'Бизнес',
      da: 'Forretning',
      fi: 'Liiketoiminta',
      sk: 'Podnikanie',
      no: 'Forretning',
      hr: 'Poslovanje',
      sr: 'Пословање'
    },
    creative: {
      en: 'Creative',
      nl: 'Creatief',
      fr: 'Créatif',
      es: 'Creativo',
      de: 'Kreativ',
      it: 'Creativo',
      pl: 'Kreatywny',
      ro: 'Creativ',
      hu: 'Kreatív',
      el: 'Δημιουργικό',
      cs: 'Kreativní',
      pt: 'Criativo',
      sv: 'Kreativ',
      bg: 'Креативен',
      da: 'Kreativ',
      fi: 'Luova',
      sk: 'Kreatívny',
      no: 'Kreativ',
      hr: 'Kreativno',
      sr: 'Креативан'
    },
    engineering: {
      en: 'Engineering',
      nl: 'Techniek',
      fr: 'Ingénierie',
      es: 'Ingeniería',
      de: 'Ingenieurwesen',
      it: 'Ingegneria',
      pl: 'Inżynieria',
      ro: 'Inginerie',
      hu: 'Mérnöki',
      el: 'Μηχανική',
      cs: 'Inženýrství',
      pt: 'Engenharia',
      sv: 'Teknik',
      bg: 'Инженерство',
      da: 'Ingeniørvidenskab',
      fi: 'Tekniikka',
      sk: 'Inžinierstvo',
      no: 'Ingeniørfag',
      hr: 'Inženjerstvo',
      sr: 'Инжењерство'
    },
    sales: {
      en: 'Sales',
      nl: 'Verkoop',
      fr: 'Ventes',
      es: 'Ventas',
      de: 'Verkauf',
      it: 'Vendite',
      pl: 'Sprzedaż',
      ro: 'Vânzări',
      hu: 'Értékesítés',
      el: 'Πωλήσεις',
      cs: 'Prodej',
      pt: 'Vendas',
      sv: 'Försäljning',
      bg: 'Продажби',
      da: 'Salg',
      fi: 'Myynti',
      sk: 'Predaj',
      no: 'Salg',
      hr: 'Prodaja',
      sr: 'Продаја'
    },
    administration: {
      en: 'Administration',
      nl: 'Administratie',
      fr: 'Administration',
      es: 'Administración',
      de: 'Verwaltung',
      it: 'Amministrazione',
      pl: 'Administracja',
      ro: 'Administrație',
      hu: 'Adminisztráció',
      el: 'Διοίκηση',
      cs: 'Administrace',
      pt: 'Administração',
      sv: 'Administration',
      bg: 'Администрация',
      da: 'Administration',
      fi: 'Hallinto',
      sk: 'Administrácia',
      no: 'Administrasjon',
      hr: 'Administracija',
      sr: 'Администрација'
    },
    hospitality: {
      en: 'Hospitality',
      nl: 'Horeca',
      fr: 'Hôtellerie',
      es: 'Hostelería',
      de: 'Gastgewerbe',
      it: 'Ospitalità',
      pl: 'Gastronomia',
      ro: 'Ospitalitate',
      hu: 'Vendéglátás',
      el: 'Φιλοξενία',
      cs: 'Pohostinství',
      pt: 'Hospitalidade',
      sv: 'Hotell & Restaurang',
      bg: 'Гостоприемство',
      da: 'Hotel & Restaurant',
      fi: 'Hotelli- ja ravintola',
      sk: 'Pohostinnosť',
      no: 'Hotell & Restaurant',
      hr: 'Ugostiteljstvo',
      sr: 'Угоститељство'
    },
    legal: {
      en: 'Legal',
      nl: 'Juridisch',
      fr: 'Juridique',
      es: 'Legal',
      de: 'Recht',
      it: 'Legale',
      pl: 'Prawo',
      ro: 'Legal',
      hu: 'Jogi',
      el: 'Νομικό',
      cs: 'Právní',
      pt: 'Jurídico',
      sv: 'Juridik',
      bg: 'Правен',
      da: 'Juridisk',
      fi: 'Oikeudellinen',
      sk: 'Právne',
      no: 'Juridisk',
      hr: 'Pravno',
      sr: 'Правно'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4 text-blue-100">
            <Link href={`/${segments.examples}`} className="hover:text-white">
              {t('examples.breadcrumb.examples') || 'Examples'}
            </Link>
            <span>/</span>
            <span className="text-white">{typeName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {typeName} {t('examples.examples') || 'Examples'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {type === 'cv' 
              ? (t('examples.cv_overview.description') || 'Browse professional CV examples by profession. Learn what makes a great CV and get inspired to create your own.')
              : (t('examples.letter_overview.description') || 'Browse professional motivational letter examples by profession. Learn what makes a great letter and get inspired to create your own.'))
            }
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('examples.overview.about_title') || `About ${typeName}s`}
          </h2>
          <div className="prose max-w-none text-gray-700">
            {type === 'cv' ? (
              <>
                <p className="mb-4">
                  {t('examples.cv_overview.intro_1') || 'A well-crafted CV (Curriculum Vitae) is essential for standing out in today\'s competitive job market. It serves as your first impression to potential employers and should effectively communicate your skills, experience, and value proposition.'}
                </p>
                <p className="mb-4">
                  {t('examples.cv_overview.intro_2') || 'Key elements of a strong CV include:'}
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>{t('examples.cv_overview.key_1') || 'Clear, professional formatting that is easy to scan'}</li>
                  <li>{t('examples.cv_overview.key_2') || 'Relevant work experience with quantifiable achievements'}</li>
                  <li>{t('examples.cv_overview.key_3') || 'Skills that match the job requirements'}</li>
                  <li>{t('examples.cv_overview.key_4') || 'ATS-friendly keywords for applicant tracking systems'}</li>
                  <li>{t('examples.cv_overview.key_5') || 'Concise, impactful descriptions that highlight your value'}</li>
                </ul>
                <p>
                  {t('examples.cv_overview.intro_3') || 'Each profession has unique requirements and expectations. Browse the examples below to see how professionals in your field present their qualifications effectively.'}
                </p>
              </>
            ) : (
              <>
                <p className="mb-4">
                  {t('examples.letter_overview.intro_1') || 'A compelling motivational letter (cover letter) complements your CV by providing context for your application and demonstrating your genuine interest in the position. It\'s your opportunity to tell your story and connect with the hiring manager.'}
                </p>
                <p className="mb-4">
                  {t('examples.letter_overview.intro_2') || 'Key elements of an effective motivational letter include:'}
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>{t('examples.letter_overview.key_1') || 'Personalized greeting and opening that captures attention'}</li>
                  <li>{t('examples.letter_overview.key_2') || 'Clear connection between your skills and the job requirements'}</li>
                  <li>{t('examples.letter_overview.key_3') || 'Specific examples of achievements and experiences'}</li>
                  <li>{t('examples.letter_overview.key_4') || 'Demonstration of knowledge about the company and role'}</li>
                  <li>{t('examples.letter_overview.key_5') || 'Professional closing with a call to action'}</li>
                </ul>
                <p>
                  {t('examples.letter_overview.intro_3') || 'Different professions require different approaches. Explore the examples below to understand how to tailor your letter for your specific field.'}
                </p>
              </>
            )}
          </div>
        </section>
        
        {/* Professions by Category */}
        {Object.entries(professionsByCategory).map(([category, professions]) => (
          <section key={category} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaBriefcase className="text-blue-500" />
              {categoryNames[category]?.[language] || category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professions.map(({ id, translation }) => (
                <Link
                  key={id}
                  href={`/${segments.examples}/${typeSegment}/${translation.slug}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {translation.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {translation.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                    {t('examples.view_example') || 'View Example'}
                    <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">
            {t('examples.cta.ready_title') || 'Ready to Create Your Own?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('examples.cta.ready_description') || 'Use our AI-powered builder to create a professional document tailored to your experience and skills.'}
          </p>
          <Link
            href={type === 'cv' ? '/' : '/?preferredArtifactType=letter'}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('examples.cta.create_button') || `Create Your ${typeName}`}
            <FaArrowRight />
          </Link>
        </section>
      </div>
    </div>
  )
}
