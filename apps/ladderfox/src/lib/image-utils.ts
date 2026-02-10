/**
 * Image utility functions for handling photo URLs
 */

/**
 * Get a safe photo URL that works with CORS
 * If the URL is external, route it through our image proxy
 * If it's already a data URI or our proxy, return as-is
 */
export function getSafePhotoUrl(photoUrl: string | undefined | null): string | undefined {
  if (!photoUrl) return undefined;
  
  // If it's already a data URI, return as-is
  if (photoUrl.startsWith('data:')) {
    return photoUrl;
  }
  
  // If it's already using our proxy, return as-is
  if (photoUrl.includes('/api/image-proxy')) {
    return photoUrl;
  }
  
  // If it's an external URL, route through our proxy
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    try {
      const url = new URL(photoUrl);
      // Only proxy external URLs (not our own domain)
      if (!url.hostname.includes('ladderfox.com') && !url.hostname.includes('localhost')) {
        return `/api/image-proxy?url=${encodeURIComponent(photoUrl)}`;
      }
    } catch {
      // Invalid URL, return as-is
      return photoUrl;
    }
  }
  
  // Return as-is for relative URLs or other cases
  return photoUrl;
}

/**
 * Generate a placeholder photo as a data URI
 */
export function generatePlaceholderPhoto(fullName: string): string {
  const name = fullName ? fullName.split(' ')[0] : 'User';
  const initial = name.charAt(0).toUpperCase();
  const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
