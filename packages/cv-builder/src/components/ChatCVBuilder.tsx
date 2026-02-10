'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from './chat/ChatInterface';
import { CVPreview } from './chat/CVPreview';

export interface ChatCVBuilderProps {
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    companyName?: string;
    fontFamily?: string;
    showCompanyName?: boolean;
  };
  templateId?: string;
  apiUrl: string;
  companyId: string;
  language?: string;
  onComplete: (data: Record<string, unknown>) => void | Promise<void>;
  onError?: (error: Error) => void;
  context: 'b2c' | 'b2b' | 'widget';
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (Array.isArray(sourceVal)) {
      // For arrays: replace entirely (experience, education, skills arrays)
      result[key] = sourceVal;
    } else if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
      if (targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
        result[key] = deepMerge(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>);
      } else {
        result[key] = { ...(sourceVal as Record<string, unknown>) };
      }
    } else if (sourceVal !== undefined && sourceVal !== null && sourceVal !== '') {
      result[key] = sourceVal;
    }
  }
  return result;
}

export function ChatCVBuilder({
  branding,
  templateId,
  apiUrl,
  companyId,
  language = 'en',
  onComplete,
  onError,
  context,
}: ChatCVBuilderProps) {
  const [cvData, setCvData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const primaryColor = branding?.primaryColor || '#4F46E5';
  const hasData = Object.keys(cvData).length > 0;

  const handleCVUpdate = useCallback((updates: Record<string, unknown>) => {
    setCvData(prev => deepMerge(prev, updates));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!hasData) return;
    setIsSubmitting(true);
    try {
      await onComplete(cvData);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [cvData, hasData, onComplete, onError]);

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFBFC',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {branding?.logo && (
            <img
              src={branding.logo}
              alt={branding.companyName || 'Company'}
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            />
          )}
          {(branding?.showCompanyName !== false && branding?.companyName) && (
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
              {branding.companyName}
            </span>
          )}
          {context === 'widget' && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: primaryColor,
              backgroundColor: `${primaryColor}10`,
              padding: '2px 8px',
              borderRadius: '6px',
            }}>
              AI CV Builder
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mobile toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            style={{
              display: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: showMobilePreview ? `${primaryColor}10` : '#FFFFFF',
              color: showMobilePreview ? primaryColor : '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            className="hk-mobile-toggle"
          >
            {showMobilePreview ? 'Chat' : 'Preview'}
          </button>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!hasData || isSubmitting}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: !hasData || isSubmitting ? '#CBD5E1' : primaryColor,
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: !hasData || isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {isSubmitting ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'hk-spin 1s linear infinite' }}>
                  <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Submit CV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split View */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Chat Panel */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
          className={showMobilePreview ? 'hk-panel-hidden' : 'hk-panel-visible'}
        >
          <ChatInterface
            apiUrl={apiUrl}
            companyId={companyId}
            cvData={cvData}
            language={language}
            primaryColor={primaryColor}
            onCVUpdate={handleCVUpdate}
          />
        </div>

        {/* Preview Panel */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: '#F8FAFC',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          className={showMobilePreview ? 'hk-panel-visible' : 'hk-panel-hidden-mobile'}
        >
          <div style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
          }}>
            <CVPreview cvData={cvData} primaryColor={primaryColor} templateId={templateId} />
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @keyframes hk-spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .hk-mobile-toggle { display: flex !important; }
          .hk-panel-hidden { display: none !important; }
          .hk-panel-hidden-mobile { display: none !important; }
          .hk-panel-visible { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hk-panel-hidden-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
