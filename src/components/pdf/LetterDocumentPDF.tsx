'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { LetterData } from '@/types/letter'
import { LETTER_TEMPLATES } from '@/data/letterTemplates'

// Prevent awkward word breaks
Font.registerHyphenationCallback(word => [word])

// Template configurations for PDF rendering
interface TemplateConfig {
  fontFamily: string
  fontSize: number
  lineHeight: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  headerColor: string
  textColor: string
  alignment: 'left' | 'center' | 'justify'
}

const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  professional: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 72, // 1 inch
    marginBottom: 72,
    marginLeft: 72,
    marginRight: 72,
    headerColor: '#1e40af',
    textColor: '#1f2937',
    alignment: 'left',
  },
  modern: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    marginTop: 54, // 0.75 inch
    marginBottom: 54,
    marginLeft: 54,
    marginRight: 54,
    headerColor: '#2563eb',
    textColor: '#374151',
    alignment: 'left',
  },
  executive: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.6,
    marginTop: 90, // 1.25 inch
    marginBottom: 90,
    marginLeft: 90,
    marginRight: 90,
    headerColor: '#18181b',
    textColor: '#1f2937',
    alignment: 'left',
  },
  creative: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.3,
    marginTop: 36, // 0.5 inch
    marginBottom: 36,
    marginLeft: 36,
    marginRight: 36,
    headerColor: '#059669',
    textColor: '#374151',
    alignment: 'left',
  },
  minimal: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.2,
    marginTop: 36,
    marginBottom: 36,
    marginLeft: 36,
    marginRight: 36,
    headerColor: '#6b7280',
    textColor: '#4b5563',
    alignment: 'left',
  },
  traditional: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 72,
    marginBottom: 72,
    marginLeft: 72,
    marginRight: 72,
    headerColor: '#92400e',
    textColor: '#1f2937',
    alignment: 'justify',
  },
}

// Get template config with fallback
const getTemplateConfig = (templateId: string | undefined): TemplateConfig => {
  return TEMPLATE_CONFIGS[templateId || 'professional'] || TEMPLATE_CONFIGS.professional
}

// Format date for letter
const formatDate = (dateStr?: string, language: string = 'en'): string => {
  if (!dateStr) {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const localeMap: Record<string, string> = {
      en: 'en-US',
      nl: 'nl-NL',
      es: 'es-ES',
      de: 'de-DE',
      fr: 'fr-FR',
    }
    return now.toLocaleDateString(localeMap[language] || 'en-US', options)
  }
  return dateStr
}

// Get default salutation based on language
const getDefaultSalutation = (language: string = 'en'): string => {
  const salutations: Record<string, string> = {
    en: 'Dear Hiring Manager,',
    nl: 'Geachte heer/mevrouw,',
    es: 'Estimado/a responsable de seleccion,',
    de: 'Sehr geehrte Damen und Herren,',
    fr: 'Madame, Monsieur,',
  }
  return salutations[language] || salutations.en
}

// Get default closing based on language
const getDefaultClosing = (language: string = 'en'): string => {
  const closings: Record<string, string> = {
    en: 'Sincerely,',
    nl: 'Met vriendelijke groet,',
    es: 'Atentamente,',
    de: 'Mit freundlichen Grussen,',
    fr: 'Cordialement,',
  }
  return closings[language] || closings.en
}

interface LetterDocumentPDFProps {
  data: LetterData
  language?: string
}

// Main Letter Document component
export const LetterDocumentPDF: React.FC<LetterDocumentPDFProps> = ({ data, language = 'en' }) => {
  const config = getTemplateConfig(data.template)

  // Create styles based on template config
  const styles = StyleSheet.create({
    page: {
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      lineHeight: config.lineHeight,
      paddingTop: config.marginTop,
      paddingBottom: config.marginBottom,
      paddingLeft: config.marginLeft,
      paddingRight: config.marginRight,
      backgroundColor: '#ffffff',
      color: config.textColor,
    },
    senderInfo: {
      marginBottom: 24,
    },
    senderName: {
      fontSize: config.fontSize + 2,
      fontWeight: 'bold',
      color: config.headerColor,
      marginBottom: 2,
    },
    senderDetail: {
      fontSize: config.fontSize - 1,
      color: '#6b7280',
      marginBottom: 1,
    },
    date: {
      marginBottom: 24,
      color: '#6b7280',
    },
    recipientInfo: {
      marginBottom: 24,
    },
    recipientName: {
      fontWeight: 'bold',
      marginBottom: 2,
    },
    recipientDetail: {
      marginBottom: 1,
    },
    subject: {
      fontWeight: 'bold',
      marginBottom: 20,
      color: config.headerColor,
    },
    salutation: {
      marginBottom: 16,
    },
    bodyParagraph: {
      marginBottom: 12,
      textAlign: config.alignment,
    },
    closing: {
      marginTop: 24,
      marginBottom: 40,
    },
    signature: {
      fontWeight: 'bold',
    },
  })

  // Parse body content
  const bodyParagraphs = Array.isArray(data.body)
    ? data.body
    : data.body
      ? [data.body]
      : []

  // Get opening/salutation
  const opening = data.opening || getDefaultSalutation(language)

  // Get closing
  const closing = data.closing || getDefaultClosing(language)

  // Get signature name
  const signatureName = data.signature || data.senderName || ''

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Information */}
        {(data.senderName || data.senderAddress || data.senderEmail || data.senderPhone) && (
          <View style={styles.senderInfo}>
            {data.senderName && (
              <Text style={styles.senderName}>{data.senderName}</Text>
            )}
            {data.senderTitle && (
              <Text style={styles.senderDetail}>{data.senderTitle}</Text>
            )}
            {data.senderAddress && (
              <Text style={styles.senderDetail}>{data.senderAddress}</Text>
            )}
            {data.senderEmail && (
              <Text style={styles.senderDetail}>{data.senderEmail}</Text>
            )}
            {data.senderPhone && (
              <Text style={styles.senderDetail}>{data.senderPhone}</Text>
            )}
          </View>
        )}

        {/* Date */}
        <View style={styles.date}>
          <Text>{formatDate(data.applicationDate, language)}</Text>
        </View>

        {/* Recipient Information */}
        {(data.recipientName || data.companyName || data.companyAddress) && (
          <View style={styles.recipientInfo}>
            {data.recipientName && (
              <Text style={styles.recipientName}>{data.recipientName}</Text>
            )}
            {data.recipientTitle && (
              <Text style={styles.recipientDetail}>{data.recipientTitle}</Text>
            )}
            {data.companyName && (
              <Text style={styles.recipientDetail}>{data.companyName}</Text>
            )}
            {data.companyAddress && (
              <Text style={styles.recipientDetail}>{data.companyAddress}</Text>
            )}
          </View>
        )}

        {/* Subject Line */}
        {(data.subject || data.jobTitle) && (
          <View style={styles.subject}>
            <Text>
              {data.subject || `Re: Application for ${data.jobTitle}`}
            </Text>
          </View>
        )}

        {/* Salutation */}
        <View style={styles.salutation}>
          <Text>{opening}</Text>
        </View>

        {/* Body Paragraphs */}
        {bodyParagraphs.map((paragraph, index) => (
          <View key={index} style={styles.bodyParagraph}>
            <Text>{paragraph}</Text>
          </View>
        ))}

        {/* Closing */}
        <View style={styles.closing}>
          <Text>{closing}</Text>
        </View>

        {/* Signature */}
        {signatureName && (
          <View style={styles.signature}>
            <Text>{signatureName}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

export default LetterDocumentPDF
