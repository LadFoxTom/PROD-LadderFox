'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { Toaster, toast } from 'react-hot-toast'
import { useSession, signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const router = useRouter()
  const { t } = useLocale()
  const { data: session, status } = useSession();

  React.useEffect(() => {
    // Debug logging
    console.log('Login page - Session status:', status);
    console.log('Login page - Session data:', session);
    
    if (status === 'authenticated') {
      console.log('User authenticated, redirecting to home...');
      router.replace('/')
    } else if (status === 'unauthenticated') {
      console.log('User not authenticated');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Use signIn directly to ensure proper session creation
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Login failed. Please check your credentials.')
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        toast.success('Login successful!')
        // Wait a moment for JWT session to be set, then redirect
        setTimeout(() => {
          router.push('/')
          router.refresh() // Refresh to update session state
        }, 300)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google login failed. Please try again.')
    }
  }

  // Handle mobile keyboard - scroll submit button into view when password field is focused
  React.useEffect(() => {
    const passwordInput = document.getElementById('login-password')
    const submitButton = document.querySelector('form button[type="submit"]')
    
    if (!passwordInput || !submitButton) return

    const handleFocus = () => {
      // Small delay to ensure keyboard is shown
      setTimeout(() => {
        submitButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 300)
    }

    passwordInput.addEventListener('focus', handleFocus)
    
    return () => {
      passwordInput.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      
      {/* Header */}
      <header className="h-14 border-b border-white/5">
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 pb-24 md:pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('auth.welcome_back')}</h1>
            <p className="text-gray-400">{t('auth.sign_in_subtitle')}</p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-6 rounded-xl font-medium hover:bg-gray-100 transition-colors mb-6 min-h-[48px] touch-manipulation"
          >
            <FcGoogle size={20} />
            {t('auth.continue_with_google')}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-gray-500">{t('auth.or')}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-2">{t('auth.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.placeholder.email')}
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">{t('auth.password')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.placeholder.password')}
                  autoComplete="current-password"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-base"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded bg-[#1a1a1a] border-white/10" />
                {t('auth.remember_me')}
              </label>
              <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300">
                {t('auth.forgot_password')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('auth.signing_in')}
                </>
              ) : (
                <>
                  {t('auth.sign_in')}
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-400 mt-8">
            {t('auth.dont_have_account')}{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              {t('auth.signup')}
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
