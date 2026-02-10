'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FiFileText, FiArrowRight, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { useLocale } from '@/context/LocaleContext'
import { CVData } from '@/types/cv'
import toast from 'react-hot-toast'

// Import react-pdf for rendering PDF
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

interface UploadedPDFPreviewProps {
  pdfDataUrl: string
  extractedData: Partial<CVData>
  fileName: string
  onConvert: (cvData: CVData) => Promise<void>
  onStartATSCheck: () => void
  isConverted: boolean
  className?: string
}

// Translations
const TEXT = {
  title: {
    en: 'Your Uploaded CV',
    nl: 'Je Geüploade CV',
    es: 'Tu CV Subido',
    de: 'Dein Hochgeladener Lebenslauf',
    fr: 'Votre CV Téléchargé'
  },
  convertTitle: {
    en: 'Convert to LadderFox CV',
    nl: 'Omzetten naar LadderFox CV',
    es: 'Convertir a CV LadderFox',
    de: 'In LadderFox-Lebenslauf umwandeln',
    fr: 'Convertir en CV LadderFox'
  },
  convertDescription: {
    en: 'Transform your CV into an optimized, ATS-friendly format with beautiful templates',
    nl: 'Transformeer je CV naar een geoptimaliseerd, ATS-vriendelijk formaat met mooie templates',
    es: 'Transforma tu CV en un formato optimizado y compatible con ATS con hermosas plantillas',
    de: 'Verwandeln Sie Ihren Lebenslauf in ein optimiertes, ATS-freundliches Format mit schönen Vorlagen',
    fr: 'Transformez votre CV en un format optimisé et compatible ATS avec de beaux modèles'
  },
  convertButton: {
    en: 'Convert CV',
    nl: 'CV Omzetten',
    es: 'Convertir CV',
    de: 'Lebenslauf Umwandeln',
    fr: 'Convertir CV'
  },
  converting: {
    en: 'Converting...',
    nl: 'Omzetten...',
    es: 'Convirtiendo...',
    de: 'Umwandeln...',
    fr: 'Conversion...'
  },
  startATSCheck: {
    en: 'Start ATS Check',
    nl: 'Start ATS Check',
    es: 'Iniciar Verificación ATS',
    de: 'ATS-Prüfung Starten',
    fr: 'Démarrer la Vérification ATS'
  },
  converted: {
    en: 'CV Converted Successfully!',
    nl: 'CV Succesvol Omgezet!',
    es: '¡CV Convertido con Éxito!',
    de: 'Lebenslauf Erfolgreich Umgewandelt!',
    fr: 'CV Converti avec Succès!'
  },
  viewConverted: {
    en: 'View your converted CV in the editor or run an ATS check',
    nl: 'Bekijk je omgezette CV in de editor of voer een ATS-check uit',
    es: 'Ver tu CV convertido en el editor o ejecutar una verificación ATS',
    de: 'Sehen Sie Ihren konvertierten Lebenslauf im Editor oder führen Sie eine ATS-Prüfung durch',
    fr: 'Voir votre CV converti dans l\'éditeur ou lancer une vérification ATS'
  },
  orText: {
    en: 'or run ATS check on your original CV',
    nl: 'of voer een ATS-check uit op je originele CV',
    es: 'o ejecutar verificación ATS en tu CV original',
    de: 'oder führen Sie eine ATS-Prüfung Ihres ursprünglichen Lebenslaufs durch',
    fr: 'ou lancer une vérification ATS sur votre CV original'
  },
  extractedInfo: {
    en: 'Extracted Information',
    nl: 'Geëxtraheerde Informatie',
    es: 'Información Extraída',
    de: 'Extrahierte Informationen',
    fr: 'Informations Extraites'
  }
}

export default function UploadedPDFPreview({
  pdfDataUrl,
  extractedData,
  fileName,
  onConvert,
  onStartATSCheck,
  isConverted,
  className = ''
}: UploadedPDFPreviewProps) {
  const { language } = useLocale()
  const [isConverting, setIsConverting] = useState(false)
  const [numPages, setNumPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pdfWidth, setPdfWidth] = useState<number>(500)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate PDF width based on container size
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Get container width and subtract padding
        const containerWidth = containerRef.current.offsetWidth - 32 // 16px padding on each side
        // Cap at 800px for readability, minimum 280px for mobile
        const newWidth = Math.max(280, Math.min(containerWidth, 800))
        setPdfWidth(newWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const getText = (key: keyof typeof TEXT) =>
    TEXT[key][language as keyof typeof TEXT.title] || TEXT[key].en

  const handleConvert = async () => {
    setIsConverting(true)
    try {
      // Format languages with proficiency levels: "English (Native)"
      const formattedLanguages: string[] = Array.isArray(extractedData.languages)
        ? extractedData.languages.map((lang: any) => {
            if (typeof lang === 'string') return lang
            const name = lang.language || lang.name || ''
            const level = lang.level || lang.proficiency || ''
            return level ? `${name} (${level})` : name
          }).filter(Boolean)
        : []

      // Format interests - join array to single string if needed
      const formattedInterests: string = Array.isArray((extractedData as any).interests)
        ? (extractedData as any).interests.join(', ')
        : (extractedData as any).interests || ''

      // Create full CVData from extracted data
      const cvData: CVData = {
        fullName: extractedData.fullName || '',
        title: extractedData.title || '',
        professionalHeadline: extractedData.title || '',
        summary: extractedData.summary || '',
        contact: extractedData.contact || {},
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || {},
        certifications: extractedData.certifications || [],
        languages: formattedLanguages,
        interests: formattedInterests,
        projects: extractedData.projects || [],
        template: 'modern',
        layout: {
          accentColor: '#2563eb'
        }
      }
      await onConvert(cvData)
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error('Failed to convert CV')
    } finally {
      setIsConverting(false)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  // Check if we have meaningful extracted data
  const hasExtractedData = extractedData && (
    extractedData.fullName ||
    extractedData.experience?.length ||
    extractedData.education?.length ||
    extractedData.skills
  )

  return (
    <div className={`flex flex-col h-full bg-gray-100 dark:bg-[#0d0d0d] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <FiFileText className="text-blue-500" size={18} />
          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            {fileName || getText('title')}
          </span>
        </div>
        {numPages > 1 && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30"
            >
              &lt;
            </button>
            <span>{currentPage} / {numPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* PDF Preview with Overlay */}
      <div ref={containerRef} className="flex-1 relative overflow-auto">
        {/* PDF Display */}
        <div className="flex justify-center p-4">
          {pdfDataUrl ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Document
                file={pdfDataUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center py-20 px-32">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
                error={
                  <div className="p-8 text-center text-gray-500">
                    <p>Could not load PDF preview</p>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  width={pdfWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 px-32 bg-white shadow-lg rounded-lg">
              <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
                <FiFileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Word document uploaded</p>
                <p className="text-sm mt-1">Preview not available for Word files</p>
              </div>
            </div>
          )}
        </div>

        {/* Overlay */}
        {!isConverted && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div
              className="max-w-md w-full rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {hasExtractedData ? (
                <>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {getText('convertTitle')}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {getText('convertDescription')}
                  </p>

                  {/* Extracted data summary */}
                  <div
                    className="rounded-lg p-3 mb-4 space-y-1"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      {getText('extractedInfo')}
                    </p>
                    {extractedData.fullName && (
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Name:</span> {extractedData.fullName}
                      </p>
                    )}
                    {extractedData.title && (
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Title:</span> {extractedData.title}
                      </p>
                    )}
                    {extractedData.experience && extractedData.experience.length > 0 && (
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Experience:</span> {extractedData.experience.length} position(s)
                      </p>
                    )}
                    {extractedData.education && extractedData.education.length > 0 && (
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Education:</span> {extractedData.education.length} item(s)
                      </p>
                    )}
                  </div>

                  {/* Convert button */}
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-70"
                  >
                    {isConverting ? (
                      <>
                        <FiLoader className="animate-spin" size={18} />
                        {getText('converting')}
                      </>
                    ) : (
                      <>
                        {getText('convertButton')}
                        <FiArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Or run ATS on original */}
                  <div className="mt-4 text-center">
                    <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      {getText('orText')}
                    </p>
                    <button
                      onClick={onStartATSCheck}
                      className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {getText('startATSCheck')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p style={{ color: 'var(--text-primary)' }}>Processing...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Converted state overlay */}
        {isConverted && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div
              className="max-w-md w-full rounded-2xl p-6 shadow-2xl text-center"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <FiCheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold mb-2 text-green-500">
                {getText('converted')}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {getText('viewConverted')}
              </p>
              <button
                onClick={onStartATSCheck}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                {getText('startATSCheck')}
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
