'use client'

import React, { memo } from 'react'
import { LetterData } from '@/types/letter'
import { LETTER_TEMPLATES } from '@/data/letterTemplates'
import { useLocale } from '@/context/LocaleContext'

interface LetterPreviewProps {
  data: LetterData
  isPreview?: boolean
}

const LetterPreview: React.FC<LetterPreviewProps> = memo(({ data, isPreview = false }) => {
  const { t } = useLocale()
  const template = LETTER_TEMPLATES.find((t) => t.id === data.template) || LETTER_TEMPLATES[0]
  const styles = template.styles

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const renderAddress = (address?: string) => {
    if (!address) return null
    return address.split('\n').map((line, index) => (
      <div key={index} className="mb-1">{line}</div>
    ))
  }

  const renderBodyContent = () => {
    if (!data.body || data.body.length === 0) {
      return (
        <div className="text-gray-500 italic">
          Your letter content will appear here. Use the AI chat to generate your letter or edit it manually.
        </div>
      )
    }

    return data.body.map((paragraph, index) => (
      <div key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </div>
    ))
  }

  return (
    <div
      data-testid={isPreview ? `letter-template-${template.id}` : undefined}
      className="bg-white p-8 shadow-lg rounded-lg letter-print-container a4-letter"
      style={{
        fontFamily: data.layout?.fontFamily || styles.fontFamily,
        fontSize: data.layout?.fontSize || styles.fontSize,
        lineHeight: data.layout?.lineSpacing || styles.lineSpacing,
        textAlign: (data.layout?.alignment || styles.alignment) as any,
        maxWidth: '100%',
        minWidth: '0',
        overflow: 'hidden'
      }}
    >
      {/* Sender Information */}
      {data.senderName && (
        <div className="mb-6">
          <div className="font-semibold text-lg mb-1">{data.senderName}</div>
          {data.senderTitle && (
            <div className="text-gray-600 mb-1">{data.senderTitle}</div>
          )}
          {data.senderAddress && (
            <div className="text-gray-600 mb-1">
              {renderAddress(data.senderAddress)}
            </div>
          )}
          {data.senderEmail && (
            <div className="text-gray-600 mb-1">{data.senderEmail}</div>
          )}
          {data.senderPhone && (
            <div className="text-gray-600">{data.senderPhone}</div>
          )}
        </div>
      )}

      {/* Date */}
      {data.layout?.showDate !== false && (
        <div className="mb-6">
          {formatDate(data.applicationDate)}
        </div>
      )}

      {/* Recipient Information */}
      {(data.recipientName || data.companyName) && (
        <div className="mb-6">
          {data.recipientName && (
            <div className="font-semibold mb-1">{data.recipientName}</div>
          )}
          {data.recipientTitle && (
            <div className="text-gray-600 mb-1">{data.recipientTitle}</div>
          )}
          {data.companyName && (
            <div className="font-semibold mb-1">{data.companyName}</div>
          )}
          {data.companyAddress && data.layout?.showAddress !== false && (
            <div className="text-gray-600">
              {renderAddress(data.companyAddress)}
            </div>
          )}
        </div>
      )}

      {/* Subject Line */}
      {data.subject && data.layout?.showSubject !== false && (
        <div className="mb-6">
          <div className="font-semibold">Subject: {data.subject}</div>
        </div>
      )}

      {/* Salutation and Opening - Check if opening already contains salutation */}
      {(() => {
        const opening = data.opening || '';
        const isSalutation = opening.toLowerCase().trim().match(/^(geachte|dear|beste|lieve|hello|hi|cher|estimado|sehr)\s/i);
        
        // Get salutation based on language
        const getSalutation = (recipientName?: string) => {
          const firstName = recipientName ? recipientName.split(' ')[0] : null;
          // Detect language from opening or default to English
          if (opening.toLowerCase().includes('geachte') || opening.toLowerCase().includes('beste')) {
            return firstName ? `Geachte ${firstName},` : 'Geachte heer/mevrouw,';
          } else if (opening.toLowerCase().includes('cher') || opening.toLowerCase().includes('chère')) {
            return firstName ? `Cher/chère ${firstName},` : 'Cher/chère recruteur,';
          } else if (opening.toLowerCase().includes('estimado')) {
            return firstName ? `Estimado/a ${firstName},` : 'Estimado/a señor/señora,';
          } else if (opening.toLowerCase().includes('sehr')) {
            return firstName ? `Sehr geehrter ${firstName},` : 'Sehr geehrte Damen und Herren,';
          } else {
            return firstName ? `Dear ${firstName},` : 'Dear Hiring Manager,';
          }
        };
        
        if (isSalutation) {
          // Opening already contains salutation, use it directly (only once)
          return (
            <div className="mb-6">
              {opening}
            </div>
          );
        } else if (opening) {
          // Opening exists but is not a salutation, show salutation + opening
          return (
            <>
              <div className="mb-6">
                {getSalutation(data.recipientName)}
              </div>
              <div className="mb-4 leading-relaxed">
                {opening}
              </div>
            </>
          );
        } else {
          // No opening, show default salutation
          return (
            <div className="mb-6">
              {getSalutation(data.recipientName)}
            </div>
          );
        }
      })()}

      {/* Body Content */}
      <div className="mb-6">
        {renderBodyContent()}
      </div>

      {/* Closing */}
      {data.closing && (
        <div className="mb-6 leading-relaxed">
          {data.closing}
        </div>
      )}

      {/* Signature */}
      <div className="mt-8">
        <div className="mb-2">{t('letter.signature.sincerely')}</div>
        <div className="font-semibold">{data.senderName || 'Your Name'}</div>
        {data.signature && (
          <div className="mt-4 text-gray-600 italic">
            {data.signature}
          </div>
        )}
      </div>
    </div>
  )
})

LetterPreview.displayName = 'LetterPreview'

export default LetterPreview 