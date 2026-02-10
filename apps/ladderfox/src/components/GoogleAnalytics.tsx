'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { hasAnalyticsConsent, getConsentPreferences } from '@/lib/consent';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  trackingId: string;
  enabled?: boolean;
}

export default function GoogleAnalytics({ 
  trackingId, 
  enabled = true 
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only proceed if enabled and in browser
    if (typeof window === 'undefined' || !enabled) {
      return;
    }

    // Initialize dataLayer if not already done
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
      window.dataLayer!.push(arguments);
    };

    // Get consent preferences
    const consent = getConsentPreferences();
    const hasConsent = hasAnalyticsConsent();

    // Initialize Google Consent Mode v2
    // This must be called before gtag('config')
    window.gtag('consent', 'default', {
      'analytics_storage': hasConsent ? 'granted' : 'denied',
      'ad_storage': hasConsent ? 'granted' : 'denied',
      'ad_user_data': hasConsent ? 'granted' : 'denied',
      'ad_personalization': hasConsent ? 'granted' : 'denied',
      'wait_for_update': 500,
    });

    // Only configure GA if consent is given
    if (hasConsent) {
      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        'anonymize_ip': true, // GDPR: anonymize IP addresses
      });
    }

    // Listen for consent updates
    const handleConsentUpdate = () => {
      const updatedConsent = getConsentPreferences();
      const updatedHasConsent = hasAnalyticsConsent();

      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': updatedHasConsent ? 'granted' : 'denied',
          'ad_storage': updatedHasConsent ? 'granted' : 'denied',
          'ad_user_data': updatedHasConsent ? 'granted' : 'denied',
          'ad_personalization': updatedHasConsent ? 'granted' : 'denied',
        });

        // If consent was just granted, initialize GA
        if (updatedHasConsent && !hasConsent) {
          window.gtag('js', new Date());
          window.gtag('config', trackingId, {
            'anonymize_ip': true,
          });
        }
      }
    };

    // Listen for storage events (when consent is updated in another tab)
    window.addEventListener('storage', handleConsentUpdate);

    return () => {
      window.removeEventListener('storage', handleConsentUpdate);
    };
  }, [trackingId, enabled]);

  // Only load the script if consent is given
  if (!enabled || !hasAnalyticsConsent()) {
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      strategy="afterInteractive"
    />
  );
}
