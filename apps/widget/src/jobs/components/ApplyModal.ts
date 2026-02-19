import type { Job } from '../types';
import { getApiUrl } from '../api';

export function openApplyModal(
  job: Job,
  companyId: string,
  _shadowRoot: ShadowRoot
): void {
  // Mount on document.body so the CV builder widget renders outside
  // the jobs widget's Shadow DOM — otherwise its styles break.
  const overlay = document.createElement('div');
  overlay.setAttribute('data-hirekit-apply-modal', '');

  // Inline styles so we don't depend on Shadow DOM CSS variables
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '99999',
    padding: '24px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  });

  const modal = document.createElement('div');
  Object.assign(modal.style, {
    background: '#FFFFFF',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #E2E8F0',
  });

  const title = document.createElement('span');
  title.textContent = `Apply — ${job.title}`;
  Object.assign(title.style, {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u2715';
  Object.assign(closeBtn.style, {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#F8FAFC',
    color: '#64748B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    lineHeight: '1',
  });

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  Object.assign(body.style, {
    padding: '24px',
    minHeight: '400px',
  });

  const loading = document.createElement('div');
  loading.textContent = 'Loading application form...';
  Object.assign(loading.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: '#94A3B8',
    fontSize: '14px',
  });
  body.appendChild(loading);

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  const close = () => {
    overlay.remove();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.body.appendChild(overlay);

  loadCVBuilder(body, companyId, job.id, close);
}

async function loadCVBuilder(
  container: HTMLElement,
  companyId: string,
  jobId: string,
  onClose: () => void
): Promise<void> {
  const apiUrl = getApiUrl();

  // Check if HireKit widget is already loaded
  if ((window as any).HireKit) {
    initWidget(container, companyId, jobId);
    return;
  }

  // Determine widget script URL
  const existingScript = document.querySelector(
    'script[src*="hirekit-widget"]'
  ) as HTMLScriptElement | null;
  const widgetUrl =
    existingScript?.src || `${apiUrl.replace('/api', '')}/widget/hirekit-widget.iife.js`;

  try {
    const script = document.createElement('script');
    script.src = widgetUrl;
    script.async = true;
    script.onload = () => {
      initWidget(container, companyId, jobId);
    };
    script.onerror = () => {
      container.innerHTML =
        '<div style="color:#EF4444;padding:1rem;text-align:center;">Failed to load application form. Please try again later.</div>';
    };
    document.head.appendChild(script);
  } catch {
    container.innerHTML =
      '<div style="color:#EF4444;padding:1rem;text-align:center;">Failed to load application form. Please try again later.</div>';
  }
}

function initWidget(
  container: HTMLElement,
  companyId: string,
  jobId: string
): void {
  container.innerHTML = '';
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'hirekit-widget-modal-' + jobId;
  container.appendChild(widgetContainer);

  (window as any).HireKit.init({
    companyId,
    jobId,
    container: widgetContainer,
  });
}
