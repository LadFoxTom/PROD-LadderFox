import { MetadataRoute } from 'next'
import { PROFESSIONS, URL_SEGMENTS, type Language } from '@/data/professions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.ladderfox.com'
  const currentDate = new Date()

  // Generate example pages for main languages and professions
  const examplePages: MetadataRoute.Sitemap = []
  const languages: Language[] = ['en', 'nl', 'fr', 'es', 'de'] // Only main languages
  
  languages.forEach(language => {
    const segments = URL_SEGMENTS[language]
    
    // Add overview pages
    examplePages.push({
      url: `${baseUrl}/${segments.examples}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    examplePages.push({
      url: `${baseUrl}/${segments.examples}/${segments.cv}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    examplePages.push({
      url: `${baseUrl}/${segments.examples}/${segments.letter}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    
    // Add individual profession pages
    PROFESSIONS.forEach(profession => {
      const translation = profession.translations[language] || profession.translations.en
      
      // CV example page
      examplePages.push({
        url: `${baseUrl}/${segments.examples}/${segments.cv}/${translation.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
      
      // Letter example page
      examplePages.push({
        url: `${baseUrl}/${segments.examples}/${segments.letter}/${translation.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quick-cv`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/letter`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/upload-cv`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cv-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/letter-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/data-compliance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    // Add all example pages for all languages
    ...examplePages,
  ]
} 