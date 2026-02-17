import type { JobsApiResponse } from './types';

export function getApiUrl(): string {
  if ((window as any).__HIREKIT_API_URL__) {
    return (window as any).__HIREKIT_API_URL__;
  }

  // Derive API URL from the script's own src (same origin)
  const script = document.querySelector(
    'script[src*="hirekit-jobs"]'
  ) as HTMLScriptElement | null;
  if (script?.src) {
    const url = new URL(script.src);
    return `${url.origin}/api`;
  }

  return 'https://app.hirekit.io/api';
}

export async function fetchJobs(companyId: string): Promise<JobsApiResponse> {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/v1/public/jobs/${companyId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
