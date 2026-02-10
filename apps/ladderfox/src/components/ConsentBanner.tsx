'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { 
  saveConsentPreferences, 
  shouldShowConsentBanner,
  type ConsentStatus 
} from '@/lib/consent';
import { FiX, FiSettings, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

export default function ConsentBanner() {
  const { t } = useLocale();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    if (shouldShowConsentBanner()) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsentPreferences({
      analytics: true,
      marketing: true,
      status: 'accepted',
    });
    setShowBanner(false);
    // Trigger page reload to apply consent
    window.location.reload();
  };

  const handleRejectAll = () => {
    saveConsentPreferences({
      analytics: false,
      marketing: false,
      status: 'rejected',
    });
    setShowBanner(false);
    // Trigger page reload to apply consent
    window.location.reload();
  };

  const handleSavePreferences = () => {
    saveConsentPreferences({
      analytics,
      marketing,
      status: 'custom',
    });
    setShowBanner(false);
    setShowSettings(false);
    // Trigger page reload to apply consent
    window.location.reload();
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={() => !showSettings && setShowBanner(false)}
      />

      {/* Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10">
          {!showSettings ? (
            // Main banner view
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('consent.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('consent.description')}
                  </p>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={t('consent.close')}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors"
                >
                  {t('consent.reject_all')}
                </button>
                <button
                  onClick={handleOpenSettings}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiSettings size={16} />
                  {t('consent.customize')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-1 sm:flex-initial"
                >
                  {t('consent.accept_all')}
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('consent.learn_more')}{' '}
                <Link 
                  href="/data-compliance" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t('consent.privacy_policy')}
                </Link>
              </p>
            </div>
          ) : (
            // Settings view
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('consent.settings.title')}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={t('consent.close')}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Essential Cookies - Always enabled */}
                <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.settings.essential.title')}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-[#3a3a3a] px-2 py-1 rounded">
                      {t('consent.settings.required')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('consent.settings.essential.description')}
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.settings.analytics.title')}
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('consent.settings.analytics.description')}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.settings.marketing.title')}
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketing}
                        onChange={(e) => setMarketing(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('consent.settings.marketing.description')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors"
                >
                  {t('consent.settings.cancel')}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-1 sm:flex-initial flex items-center justify-center gap-2"
                >
                  <FiCheck size={16} />
                  {t('consent.settings.save')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
