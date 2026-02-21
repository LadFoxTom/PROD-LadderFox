import type { Job } from '../types';

const WORKPLACE_LABELS: Record<string, string> = { 'on-site': 'On-site', hybrid: 'Hybrid', remote: 'Remote' };
const TYPE_LABELS: Record<string, string> = { 'full-time': 'Full-time', 'part-time': 'Part-time', contract: 'Contract', internship: 'Internship', freelance: 'Freelance' };
const EXP_LABELS: Record<string, string> = { entry: 'Entry', mid: 'Mid', senior: 'Senior', lead: 'Lead', director: 'Director', executive: 'Executive' };

function formatSalary(job: Job): string | null {
  if (job.showSalary === false) return null;
  if (!job.salaryMin && !job.salaryMax) return null;
  const currency = job.salaryCurrency || 'EUR';
  const period = job.salaryPeriod === 'month' ? '/mo' : job.salaryPeriod === 'hour' ? '/hr' : '/yr';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}${period}`;
  if (job.salaryMin) return `From ${fmt(job.salaryMin)}${period}`;
  return `Up to ${fmt(job.salaryMax!)}${period}`;
}

function ensureHtml(text: string | null): string {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return text.split('\n').filter(Boolean).map(line => `<p>${line}</p>`).join('');
}

export function renderJobDetail(
  job: Job,
  onBack: () => void,
  onApply: (job: Job) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hk-detail';

  const salary = formatSalary(job);
  const badges: string[] = [];
  if (job.department) badges.push(job.department);
  if (job.location) badges.push(`📍 ${job.location}`);
  if (job.workplaceType) badges.push(WORKPLACE_LABELS[job.workplaceType] || job.workplaceType);
  if (job.employmentTypes?.length) {
    job.employmentTypes.forEach(t => badges.push(TYPE_LABELS[t] || t));
  } else if (job.type) {
    badges.push(TYPE_LABELS[job.type] || job.type);
  }
  if (job.experienceLevel) badges.push(EXP_LABELS[job.experienceLevel] || job.experienceLevel);

  const badgesHtml = badges
    .map((b) => `<span class="hk-badge">${b}</span>`)
    .join('');

  const benefitTagsHtml = job.benefitTags?.length
    ? `<div class="hk-detail-benefit-tags">${job.benefitTags.map(t => `<span class="hk-badge">${t}</span>`).join('')}</div>`
    : '';

  container.innerHTML = `
    <button class="hk-detail-back">← Back to all jobs</button>
    <div class="hk-detail-title">${job.title}</div>
    <div class="hk-detail-meta">${badgesHtml}</div>
    ${salary ? `<div class="hk-detail-salary">${salary}</div>` : ''}
    ${job.description ? `<div class="hk-detail-description">${ensureHtml(job.description)}</div>` : ''}
    ${job.requirements ? `<div class="hk-detail-section"><h3 class="hk-detail-section-title">Requirements</h3><div class="hk-detail-description">${ensureHtml(job.requirements)}</div></div>` : ''}
    ${job.benefits || job.benefitTags?.length ? `<div class="hk-detail-section"><h3 class="hk-detail-section-title">Benefits & Perks</h3>${benefitTagsHtml}${job.benefits ? `<div class="hk-detail-description">${ensureHtml(job.benefits)}</div>` : ''}</div>` : ''}
    <div class="hk-detail-apply">
      <button class="hk-btn hk-btn-primary hk-detail-apply-btn">Apply for this position</button>
    </div>
  `;

  container.querySelector('.hk-detail-back')!.addEventListener('click', onBack);
  container.querySelector('.hk-detail-apply-btn')!.addEventListener('click', () => onApply(job));

  return container;
}
