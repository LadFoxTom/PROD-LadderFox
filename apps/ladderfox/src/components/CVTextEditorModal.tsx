import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave, FaUndo, FaRedo, FaCopy, FaDownload, FaSpinner } from 'react-icons/fa'
import { CVData } from '@/types/cv'
import { useLocale } from '@/context/LocaleContext'
import toast from 'react-hot-toast'

interface CVTextEditorModalProps {
  isOpen: boolean
  onClose: () => void
  cvData: CVData
  cvText: string
  onSave: (editedText: string) => void
}

export default function CVTextEditorModal({ 
  isOpen, 
  onClose, 
  cvData, 
  cvText, 
  onSave 
}: CVTextEditorModalProps) {
  const { t } = useLocale()
  const [editedText, setEditedText] = useState(cvText)
  const [originalText, setOriginalText] = useState(cvText)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setEditedText(cvText)
      setOriginalText(cvText)
      setHasChanges(false)
      updateCounts(cvText)
    }
  }, [isOpen, cvText])

  const updateCounts = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
    setCharCount(text.length)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setEditedText(newText)
    setHasChanges(newText !== originalText)
    updateCounts(newText)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      onSave(editedText)
      setOriginalText(editedText)
      setHasChanges(false)
      toast.success('CV text updated successfully')
    } catch (error) {
      console.error('Error saving CV text:', error)
      toast.error('Failed to save CV text')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setEditedText(originalText)
    setHasChanges(false)
    updateCounts(originalText)
    toast.success('Changes reset to original')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText)
      toast.success('CV text copied to clipboard')
    } catch (error) {
      console.error('Error copying text:', error)
      toast.error('Failed to copy text')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cvData.fullName || 'CV'}-text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('CV text downloaded')
  }

  const getCVTitle = () => {
    return cvData.fullName || cvData.title || 'CV'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'var(--overlay)' }}>
      <div className="rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border-medium)' }}>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-heading)' }}>
              Edit CV Text for Letter Generation
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Review and edit your CV information before using it for the motivational letter
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)]">
          {/* Left Panel - Editor */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                CV Text Content
              </label>
            </div>
            <div className="relative flex-1 min-h-0">
              <textarea
                value={editedText}
                onChange={handleTextChange}
                className="w-full h-full p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm overflow-y-auto"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="Your CV content will appear here..."
              />
              <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded" style={{ color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
                {wordCount} words, {charCount} chars
              </div>
            </div>
          </div>

          {/* Right Panel - Info & Actions */}
          <div className="w-full lg:w-80 p-6" style={{ borderLeft: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="space-y-6">
              {/* CV Info */}
              <div>
                <h4 className="font-medium mb-3" style={{ color: 'var(--text-heading)' }}>CV Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Name:</span>
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{getCVTitle()}</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Title:</span>
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{cvData.title || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Template:</span>
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{cvData.template || 'default'}</span>
                  </div>
                  {cvData.experience && (
                    <div>
                      <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Experience:</span>
                      <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{cvData.experience.length} positions</span>
                    </div>
                  )}
                  {cvData.education && (
                    <div>
                      <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Education:</span>
                      <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{cvData.education.length} entries</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-medium mb-3" style={{ color: 'var(--text-heading)' }}>Editing Tips</h4>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Remove sensitive information you don't want to share</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Add specific achievements relevant to the job</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Ensure all dates and company names are accurate</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Keep the most relevant experience for the position</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="w-full flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  >
                    <FaUndo className="mr-2" />
                    Reset Changes
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaCopy className="mr-2" />
                    Copy to Clipboard
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    Download as Text
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="pt-4" style={{ borderTop: '1px solid var(--border-medium)' }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                    backgroundColor: hasChanges ? 'var(--color-ladderfox-yellow)' : 'var(--color-ladderfox-light)',
                    color: hasChanges ? 'var(--color-ladderfox-dark)' : 'var(--color-ladderfox-dark)'
                  }}>
                    {hasChanges ? 'Modified' : 'Saved'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6" style={{ borderTop: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {hasChanges && (
              <span style={{ color: 'var(--color-ladderfox-orange)' }}>
                ⚠️ You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-colors border"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-medium)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 