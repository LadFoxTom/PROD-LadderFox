import { notFound } from 'next/navigation';
import { db } from '@repo/database-hirekit';
import { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationForm } from '../components/ApplicationForm';
import { ensureHtml } from '@/lib/html-utils';

interface PageProps {
  params: { slug: string; jobId: string };
}

async function getJobData(slug: string, jobId: string) {
  const company = await db.company.findFirst({
    where: { slug },
    include: {
      branding: true,
      landingPage: true,
    },
  });

  if (!company || !company.landingPage?.published) return null;

  const job = await db.job.findFirst({
    where: { id: jobId, companyId: company.id, active: true },
  });

  if (!job) return null;
  return { company, job };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getJobData(params.slug, params.jobId);
  if (!data) return {};

  const { company, job } = data;
  const title = `${job.title} at ${company.name}`;
  const description = job.description?.slice(0, 160) || `Apply for ${job.title} at ${company.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(company.landingPage?.socialImageUrl && {
        images: [{ url: company.landingPage.socialImageUrl }],
      }),
    },
  };
}

const TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

export default async function JobDetailPage({ params }: PageProps) {
  const data = await getJobData(params.slug, params.jobId);
  if (!data) notFound();

  const { company, job } = data;
  const branding = company.branding || { primaryColor: '#4F46E5', logoUrl: null, fontFamily: 'Inter', showCompanyName: true };
  const primaryColor = branding.primaryColor;

  const salaryPeriod = (job as any).salaryPeriod || 'year';
  const periodLabel = salaryPeriod === 'month' ? '/mo' : salaryPeriod === 'hour' ? '/hr' : '/yr';
  const showSalary = (job as any).showSalary !== false;
  const salary = showSalary && (job.salaryMin || job.salaryMax)
    ? job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()} ${job.salaryCurrency || 'EUR'}${periodLabel}`
      : job.salaryMin
        ? `From ${job.salaryMin.toLocaleString()} ${job.salaryCurrency || 'EUR'}${periodLabel}`
        : `Up to ${job.salaryMax!.toLocaleString()} ${job.salaryCurrency || 'EUR'}${periodLabel}`
    : null;

  const workplaceLabels: Record<string, string> = { 'on-site': 'On-site', hybrid: 'Hybrid', remote: 'Remote' };
  const experienceLabels: Record<string, string> = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior', lead: 'Lead', director: 'Director', executive: 'Executive' };
  const unitTextMap: Record<string, string> = { year: 'YEAR', month: 'MONTH', hour: 'HOUR' };

  // Build employment types for JSON-LD
  const employmentTypes: string[] = (job as any).employmentTypes?.length
    ? (job as any).employmentTypes.map((t: string) => t.toUpperCase().replace('-', '_'))
    : job.type ? [job.type.toUpperCase().replace('-', '_')] : [];

  // JSON-LD for this specific job
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || '',
    datePosted: job.createdAt.toISOString().split('T')[0],
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      ...(branding.logoUrl && { logo: branding.logoUrl }),
    },
    ...(job.location && {
      jobLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: job.location },
      },
    }),
    ...(employmentTypes.length && { employmentType: employmentTypes.length === 1 ? employmentTypes[0] : employmentTypes }),
    ...((job as any).workplaceType === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
    ...((job as any).experienceLevel && { experienceRequirements: experienceLabels[(job as any).experienceLevel] || (job as any).experienceLevel }),
    ...(job.salaryMin && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salaryCurrency || 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          ...(job.salaryMax && { maxValue: job.salaryMax }),
          unitText: unitTextMap[salaryPeriod] || 'YEAR',
        },
      },
    }),
  };

  return (
    <div style={{ fontFamily: branding.fontFamily }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/career/${params.slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {branding.logoUrl && (
              <img src={branding.logoUrl} alt={company.name} className="h-8" />
            )}
            {branding.showCompanyName && (
              <span className="font-semibold text-slate-900">{company.name}</span>
            )}
          </Link>
          <Link
            href={`/career/${params.slug}`}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <i className="ph ph-arrow-left text-xs" />
            All Jobs
          </Link>
        </div>
      </nav>

      {/* Job Detail */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-map-pin" />
                {job.location}
              </span>
            )}
            {(job as any).workplaceType && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {workplaceLabels[(job as any).workplaceType] || (job as any).workplaceType}
              </span>
            )}
            {((job as any).employmentTypes?.length > 0 ? (job as any).employmentTypes : job.type ? [job.type] : []).map((t: string) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {TYPE_LABELS[t] || t}
              </span>
            ))}
            {(job as any).experienceLevel && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-chart-line-up" />
                {experienceLabels[(job as any).experienceLevel] || (job as any).experienceLevel}
              </span>
            )}
            {job.department && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-buildings" />
                {job.department}
              </span>
            )}
            {salary && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-currency-circle-dollar" />
                {salary}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="mb-8">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: ensureHtml(job.description) }}
            />
          </div>
        )}

        {/* Requirements */}
        {(job as any).requirements && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: ensureHtml((job as any).requirements) }}
            />
          </div>
        )}

        {/* Benefits */}
        {((job as any).benefits || (job as any).benefitTags?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Benefits & Perks</h2>
            {(job as any).benefitTags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(job as any).benefitTags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {(job as any).benefits && (
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: ensureHtml((job as any).benefits) }}
              />
            )}
          </div>
        )}

        {/* Application Form */}
        <ApplicationForm
          companyId={company.id}
          jobId={job.id}
          primaryColor={primaryColor}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Powered by HireKit
      </div>
    </div>
  );
}
