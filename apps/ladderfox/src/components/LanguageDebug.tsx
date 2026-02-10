'use client'

import { useLocale } from '@/context/LocaleContext'
import { useEffect, useState } from 'react'

export default function LanguageDebug() {
  const { language, t, isClient } = useLocale()
  const [browserLang, setBrowserLang] = useState<string>('')
  const [localStorageLang, setLocalStorageLang] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserLang(navigator.language)
      setLocalStorageLang(localStorage.getItem('language') || 'none')
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold mb-2">🌐 Language Debug</div>
      <div className="space-y-1">
        <div>Current Language: <span className="text-blue-400">{language}</span></div>
        <div>Browser Language: <span className="text-green-400">{browserLang}</span></div>
        <div>LocalStorage: <span className="text-yellow-400">{localStorageLang}</span></div>
        <div>Is Client: <span className="text-purple-400">{isClient ? 'Yes' : 'No'}</span></div>
        <div className="mt-2 pt-2 border-t border-white/20">
          <div>Test Translation:</div>
          <div className="text-blue-300">{t('landing.main.title')}</div>
        </div>
      </div>
    </div>
  )
}
