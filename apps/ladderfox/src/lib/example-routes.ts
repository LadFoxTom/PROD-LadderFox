/**
 * Utility functions for example page routing
 */

import { URL_SEGMENTS, PROFESSIONS, type Language } from '@/data/professions'

/**
 * Detect language from URL path
 */
export function detectLanguageFromPath(pathname: string): Language {
  // Check if path starts with any language-specific segment
  for (const [lang, segments] of Object.entries(URL_SEGMENTS)) {
    if (pathname.startsWith(`/${segments.examples}/`)) {
      return lang as Language
    }
  }
  return 'en' // Default to English
}

/**
 * Get profession ID from slug and language
 */
export function getProfessionIdFromSlug(slug: string, language: Language): string | null {
  const profession = PROFESSIONS.find(p => {
    const translation = p.translations[language] || p.translations.en
    return translation.slug === slug
  })
  return profession?.id || null
}

/**
 * Get profession slug from ID and language
 */
export function getProfessionSlugFromId(id: string, language: Language): string | null {
  const profession = PROFESSIONS.find(p => p.id === id)
  if (!profession) return null
  const translation = profession.translations[language] || profession.translations.en
  return translation.slug
}

/**
 * Parse example page URL
 * Returns: { language, type, professionId } or null if invalid
 */
export function parseExampleUrl(pathname: string): {
  language: Language
  type: 'cv' | 'letter'
  professionId: string
} | null {
  const language = detectLanguageFromPath(pathname)
  const segments = URL_SEGMENTS[language]
  
  // Pattern: /{examples}/{type}/{profession}
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 3) return null
  
  const [examplesSegment, typeSegment, professionSlug] = parts
  
  if (examplesSegment !== segments.examples) return null
  
  const type = typeSegment === segments.cv ? 'cv' : 
               typeSegment === segments.letter ? 'letter' : null
  if (!type) return null
  
  const professionId = getProfessionIdFromSlug(professionSlug, language)
  if (!professionId) return null
  
  return { language, type, professionId }
}

/**
 * Generate all static paths for example pages
 */
export function generateExamplePaths(): Array<{
  params: { profession: string }
  language: Language
  type: 'cv' | 'letter'
}> {
  const paths: Array<{
    params: { profession: string }
    language: Language
    type: 'cv' | 'letter'
  }> = []
  
  // Only generate paths for main languages
  const mainLanguages: Language[] = ['en', 'nl', 'fr', 'es', 'de']
  
  for (const profession of PROFESSIONS) {
    for (const language of mainLanguages) {
      const translation = profession.translations[language] || profession.translations.en
      paths.push(
        {
          params: { profession: translation.slug },
          language,
          type: 'cv'
        },
        {
          params: { profession: translation.slug },
          language,
          type: 'letter'
        }
      )
    }
  }
  
  return paths
}
