'use client'

import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useLocale } from '@/context/LocaleContext'
import { FiSun, FiMoon } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocale()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onMouseDown={(e) => e.currentTarget.blur()}
      className="p-2 flex items-center justify-center rounded-lg transition-colors min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      style={{
        backgroundColor: isHovered ? 'var(--bg-hover)' : 'transparent',
      }}
      title={theme === 'day' ? t('theme.switch_to_night') : t('theme.switch_to_day')}
      aria-label={theme === 'day' ? t('theme.switch_to_night') : t('theme.switch_to_day')}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'day' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'day' ? (
          <FiSun size={20} className="text-yellow-500" />
        ) : (
          <FiMoon size={20} className="text-blue-400" />
        )}
      </motion.div>
    </button>
  )
}
