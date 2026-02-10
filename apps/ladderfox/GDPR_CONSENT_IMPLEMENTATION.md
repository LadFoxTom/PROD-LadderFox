# GDPR Consent Banner Implementation

## Overview

This document describes the GDPR-compliant consent banner implementation for LadderFox, which is required for EU users under GDPR and ePrivacy regulations.

## What Was Implemented

### 1. Consent Management System (`src/lib/consent.ts`)
- Stores user consent preferences in localStorage
- Manages consent status (pending, accepted, rejected, custom)
- Tracks analytics and marketing cookie preferences separately
- Consent expires after 1 year (configurable)
- Provides utility functions to check consent status

### 2. Consent Banner Component (`src/components/ConsentBanner.tsx`)
- GDPR-compliant cookie consent banner
- Three options: Accept All, Reject All, Customize
- Customize mode allows granular control over cookie categories:
  - Essential cookies (always required)
  - Analytics cookies (optional)
  - Marketing cookies (optional)
- Responsive design with dark mode support
- Integrated with translation system (EN, NL, DE, ES, FR)
- Links to privacy policy page

### 3. Google Analytics with Consent Mode v2 (`src/components/GoogleAnalytics.tsx`)
- Implements Google Consent Mode v2 (required for EU compliance)
- Only loads Google Analytics script after user consent
- Respects user preferences for analytics and ad storage
- Anonymizes IP addresses (GDPR requirement)
- Updates consent status dynamically when user changes preferences
- Listens for consent updates across browser tabs

### 4. Hotjar Integration
- Updated to respect analytics consent
- Only loads if user has given analytics consent

## Key Features

### GDPR Compliance
✅ **Explicit Consent**: Users must actively accept cookies before tracking begins  
✅ **Granular Control**: Users can choose which cookie categories to allow  
✅ **Easy Rejection**: One-click option to reject all non-essential cookies  
✅ **Consent Storage**: Preferences stored locally with expiry date  
✅ **Privacy Policy Link**: Direct link to data compliance page  
✅ **Google Consent Mode v2**: Properly configured for EU compliance  

### User Experience
✅ **Non-Intrusive**: Banner appears at bottom, doesn't block content  
✅ **Clear Language**: Simple, understandable cookie descriptions  
✅ **Settings Panel**: Detailed view for users who want more control  
✅ **Responsive**: Works on all device sizes  
✅ **Dark Mode**: Supports both light and dark themes  
✅ **Multi-Language**: Available in 5 languages  

## How It Works

1. **First Visit**: User sees consent banner on first visit
2. **User Choice**: User can Accept All, Reject All, or Customize
3. **Consent Storage**: Preference saved to localStorage with timestamp
4. **Script Loading**: Analytics scripts only load if consent is given
5. **Consent Mode**: Google Analytics uses Consent Mode v2 to respect preferences
6. **Future Visits**: Banner doesn't show again until consent expires (1 year)

## Configuration

### Environment Variables

```env
# Google Analytics (already configured)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-BT59N8YB46"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED="true"  # Optional: enable in dev

# Hotjar (already configured)
NEXT_PUBLIC_HOTJAR_SITE_ID="1234567"
NEXT_PUBLIC_HOTJAR_ENABLED="false"  # Optional: enable in dev
```

### Consent Expiry

Consent expires after 1 year by default. To change this, modify `CONSENT_EXPIRY_DAYS` in `src/lib/consent.ts`.

## Testing

### Test Consent Banner
1. Clear browser localStorage: `localStorage.clear()` in browser console
2. Refresh page - banner should appear
3. Test Accept All - analytics should load
4. Test Reject All - analytics should not load
5. Test Customize - select specific cookie types

### Test Consent Persistence
1. Accept cookies
2. Refresh page - banner should not appear
3. Check localStorage: `localStorage.getItem('ladderfox_consent')`

### Test Google Consent Mode
1. Open browser DevTools → Network tab
2. Accept analytics cookies
3. Look for requests to `googletagmanager.com`
4. Check that `gtag('consent', 'update')` is called with correct permissions

## Legal Requirements Met

✅ **GDPR Article 7**: Conditions for consent  
✅ **GDPR Article 13**: Information to be provided  
✅ **ePrivacy Directive**: Consent for cookies  
✅ **Google Consent Mode v2**: Required for Google Analytics in EU  

## Privacy Policy

The consent banner links to `/data-compliance` which contains:
- Detailed cookie policy
- Data collection information
- User rights under GDPR
- Contact information for privacy requests

## Future Enhancements

Potential improvements:
- [ ] Server-side consent storage (for cross-device sync)
- [ ] Consent analytics (track consent rates)
- [ ] A/B testing different banner designs
- [ ] Integration with consent management platforms (OneTrust, Cookiebot)
- [ ] Cookie list/details page showing all cookies used

## Support

For questions about this implementation:
- See `/data-compliance` page for privacy information
- Contact: privacy@ladderfox.com

## References

- [Google Consent Mode v2](https://support.google.com/analytics/answer/9976101)
- [GDPR Cookie Consent Requirements](https://gdpr.eu/cookies/)
- [ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)
