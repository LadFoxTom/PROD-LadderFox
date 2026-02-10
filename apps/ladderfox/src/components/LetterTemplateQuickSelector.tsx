'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LETTER_TEMPLATES } from '@/data/letterTemplates'
import { useLocale } from '@/context/LocaleContext'
import { 
  FiCheck, FiMail, FiFileText
} from 'react-icons/fi'

interface LetterTemplateQuickSelectorProps {
  currentTemplate: string
  onTemplateChange: (template: string) => void
  className?: string
}

// Template preview mini-thumbnails (stylized icons)
const getTemplateIcon = (templateId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'professional': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-2 bg-current opacity-80 rounded-sm w-3/4" />
        <div className="h-1 bg-current opacity-30 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-4/5" />
        </div>
      </div>
    ),
    'modern': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-2 bg-current opacity-70 rounded-sm w-2/3" />
        <div className="h-0.5 bg-current opacity-20 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1 bg-current opacity-35 rounded-full" />
          <div className="h-1 bg-current opacity-35 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-35 rounded-full" />
        </div>
      </div>
    ),
    'executive': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-2.5 bg-current opacity-90 rounded-sm w-4/5" />
        <div className="h-1 bg-current opacity-20 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1.5 bg-current opacity-30 rounded-sm" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
        </div>
      </div>
    ),
    'creative': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-sm w-3/4" />
        <div className="h-1 bg-current opacity-25 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
        </div>
      </div>
    ),
    'minimal': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-1.5 bg-current opacity-60 rounded-sm w-2/3" />
        <div className="h-0.5 bg-current opacity-10 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-0.5 bg-current opacity-30 rounded-full" />
          <div className="h-0.5 bg-current opacity-30 rounded-full w-5/6" />
          <div className="h-0.5 bg-current opacity-30 rounded-full" />
        </div>
      </div>
    ),
    'traditional': (
      <div className="w-full h-full flex flex-col p-2 gap-1">
        <div className="h-2 bg-current opacity-85 rounded-sm w-4/5" />
        <div className="h-1 bg-current opacity-25 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-4/5" />
        </div>
      </div>
    ),
  }
  return iconMap[templateId] || iconMap['professional']
}

export const LetterTemplateQuickSelector: React.FC<LetterTemplateQuickSelectorProps> = ({
  currentTemplate,
  onTemplateChange,
  className = '',
}) => {
  const { t } = useLocale()
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const getStyleBadgeColor = (style: string) => {
    switch (style) {
      case 'formal':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'semi-formal':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'creative':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <FiMail className="text-blue-500" size={18} />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Letter Templates
        </h3>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {LETTER_TEMPLATES.map((template) => {
            const isSelected = currentTemplate === template.id
            
            return (
              <motion.button
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTemplateChange(template.id)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {/* Template Preview */}
                <div 
                  className="aspect-[8.5/11] w-full relative"
                  style={{ color: template.preview.includes('blue') ? '#2563eb' : 
                           template.preview.includes('purple') ? '#7c3aed' :
                           template.preview.includes('green') ? '#059669' :
                           template.preview.includes('amber') ? '#f59e0b' :
                           template.preview.includes('gray') ? '#6b7280' : '#2563eb' }}
                >
                  <div className={`absolute inset-0 ${template.preview} p-2`}>
                    {getTemplateIcon(template.id)}
                  </div>
                  
                  {/* Selected Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <FiCheck size={12} className="text-white" />
                    </motion.div>
                  )}

                  {/* Style Badge */}
                  <div className={`absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${getStyleBadgeColor(template.styles.letterStyle)}`}>
                    {template.styles.letterStyle}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {template.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay with Details */}
                <AnimatePresence>
                  {hoveredTemplate === template.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center"
                    >
                      <h4 className="text-sm font-bold text-white mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-300 mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] rounded">
                          {template.styles.fontFamily.split(',')[0]}
                        </span>
                        <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] rounded">
                          {template.styles.fontSize}
                        </span>
                        <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] rounded">
                          {template.styles.letterStyle}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <FiFileText size={12} className="text-blue-500" />
          Template Tips
        </h4>
        <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
          <li className="flex items-start gap-1.5">
            <span className="text-blue-500 mt-0.5">•</span>
            <span><strong>Professional</strong> and <strong>Traditional</strong> work best for formal applications</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-purple-500 mt-0.5">•</span>
            <span><strong>Modern</strong> and <strong>Minimal</strong> are ideal for contemporary companies</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-green-500 mt-0.5">•</span>
            <span><strong>Creative</strong> and <strong>Executive</strong> emphasize sophistication and innovation</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LetterTemplateQuickSelector
