/**
 * Consent Management Utilities
 * Handles GDPR-compliant cookie consent storage and retrieval
 */

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  status: ConsentStatus;
}

const CONSENT_STORAGE_KEY = 'ladderfox_consent';
const CONSENT_EXPIRY_DAYS = 365; // Consent expires after 1 year

/**
 * Get stored consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const preferences: ConsentPreferences = JSON.parse(stored);
    
    // Check if consent has expired
    const expiryDate = preferences.timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    if (Date.now() > expiryDate) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    return preferences;
  } catch (error) {
    console.error('Error reading consent preferences:', error);
    return null;
  }
}

/**
 * Save consent preferences
 */
export function saveConsentPreferences(preferences: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getConsentPreferences();
    const newPreferences: ConsentPreferences = {
      analytics: preferences.analytics ?? existing?.analytics ?? false,
      marketing: preferences.marketing ?? existing?.marketing ?? false,
      timestamp: Date.now(),
      status: preferences.status ?? 'custom',
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newPreferences));
  } catch (error) {
    console.error('Error saving consent preferences:', error);
  }
}

/**
 * Check if user has given consent for analytics
 */
export function hasAnalyticsConsent(): boolean {
  const preferences = getConsentPreferences();
  return preferences?.analytics === true;
}

/**
 * Check if user has given consent for marketing
 */
export function hasMarketingConsent(): boolean {
  const preferences = getConsentPreferences();
  return preferences?.marketing === true;
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  return getConsentPreferences() === null;
}

/**
 * Clear consent preferences (for testing or user request)
 */
export function clearConsentPreferences(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}
