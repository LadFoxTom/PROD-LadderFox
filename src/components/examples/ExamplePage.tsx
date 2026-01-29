'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import { getProfession, URL_SEGMENTS, type Language } from '@/data/professions'
import { FaCheckCircle, FaArrowRight, FaFileAlt, FaUser } from 'react-icons/fa'

interface ExamplePageProps {
  professionId: string
  type: 'cv' | 'letter'
  language: Language
}

export default function ExamplePage({ professionId, type, language }: ExamplePageProps) {
  const { t } = useLocale()
  const profession = getProfession(professionId, language)
  
  if (!profession) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('examples.not_found.title') || 'Example Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('examples.not_found.description') || 'The requested example could not be found.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('examples.back_to_home') || 'Back to Home'} →
          </Link>
        </div>
      </div>
    )
  }
  
  const segments = URL_SEGMENTS[language]
  const typeName = type === 'cv' 
    ? (t('examples.cv') || 'CV')
    : (t('examples.letter') || 'Motivational Letter')
  
  const ctaUrl = type === 'cv' ? '/' : '/?preferredArtifactType=letter'
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4 text-blue-100">
            <Link href={`/${segments.examples}`} className="hover:text-white">
              {t('examples.breadcrumb.examples') || 'Examples'}
            </Link>
            <span>/</span>
            <Link href={`/${segments.examples}/${type === 'cv' ? segments.cv : segments.letter}`} className="hover:text-white">
              {typeName}
            </Link>
            <span>/</span>
            <span className="text-white">{profession.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {profession.name} {typeName} {t('examples.example') || 'Example'}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl">
            {profession.description}
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Why This Example is Good */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            {t('examples.why_good.title') || 'Why This Example is Effective'}
          </h2>
          <ul className="space-y-4">
            {profession.whyGood.map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{reason}</p>
              </li>
            ))}
          </ul>
        </section>
        
        {/* Key Skills */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaUser className="text-blue-500" />
            {t('examples.key_skills.title') || 'Key Skills for This Profession'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profession.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
        
        {/* Tips */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('examples.tips.title') || 'Tips for Creating Your {typeName}'}
          </h2>
          <div className="space-y-4">
            {profession.tips.map((tip, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Visual Preview Placeholder */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('examples.preview.title') || 'Example Preview'}
          </h2>
          <div className="bg-gray-100 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
            <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              {t('examples.preview.placeholder') || 'CV/Letter preview image will be displayed here'}
            </p>
            <p className="text-sm text-gray-500">
              {t('examples.preview.note') || 'This is a placeholder. In production, you would show an actual template preview.'}
            </p>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('examples.cta.title') || 'Ready to Create Your Own {typeName}?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('examples.cta.description') || 'Use our AI-powered builder to create a professional {typeName} tailored to your experience and skills.'}
          </p>
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('examples.cta.button') || 'Create Your {typeName}'}
            <FaArrowRight />
          </Link>
        </section>
        
        {/* Related Examples */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('examples.related.title') || 'Explore More Examples'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/${segments.examples}/${type === 'cv' ? segments.cv : segments.letter}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('examples.related.all') || 'All {typeName} Examples'}
              </h3>
              <p className="text-sm text-gray-600">
                {t('examples.related.browse') || 'Browse all examples for this document type'}
              </p>
            </Link>
            <Link
              href={`/${segments.examples}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('examples.related.examples') || 'All Examples'}
              </h3>
              <p className="text-sm text-gray-600">
                {t('examples.related.browse_all') || 'Browse all CV and letter examples'}
              </p>
            </Link>
            <Link
              href="/"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('examples.related.builder') || 'CV Builder'}
              </h3>
              <p className="text-sm text-gray-600">
                {t('examples.related.start_building') || 'Start building your CV now'}
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
