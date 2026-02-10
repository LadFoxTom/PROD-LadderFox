'use client';

import { useEffect } from 'react';
import { hasAnalyticsConsent } from '@/lib/consent';

declare global {
  interface Window {
    hj?: (action: string, ...args: any[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}

interface HotjarProps {
  siteId?: number;
  enabled?: boolean;
}

export default function Hotjar({ siteId, enabled = true }: HotjarProps) {
  useEffect(() => {
    // Only load in browser and if enabled
    if (typeof window === 'undefined' || !enabled || !siteId) {
      return;
    }

    // Check for analytics consent (Hotjar is an analytics tool)
    if (!hasAnalyticsConsent()) {
      return;
    }

    // Check if already loaded
    if (window.hj) {
      return;
    }

    // Initialize Hotjar
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: siteId, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }, [siteId, enabled]);

  return null;
}

// Helper function to track state changes (for SPA navigation)
export function hotjarStateChange(state: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('stateChange', state);
  }
}

// Helper function to identify users (optional)
export function hotjarIdentify(userId: string, attributes?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('identify', userId, attributes);
  }
}
