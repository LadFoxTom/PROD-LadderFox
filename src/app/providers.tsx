'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/context/AuthContext'
import { LocaleProvider } from '@/context/LocaleContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ModalProvider } from '@/components/providers/ModalProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 