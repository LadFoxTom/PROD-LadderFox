import { notFound } from 'next/navigation';
import { db } from '@repo/database-hirekit';
import { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationForm } from '../components/ApplicationForm';

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

  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()} ${job.salaryCurrency || 'EUR'}`
      : job.salaryMin
        ? `From ${job.salaryMin.toLocaleString()} ${job.salaryCurrency || 'EUR'}`
        : null;

  // JSON-LD for this specific job
  const jsonLd = {
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
    ...(job.type && { employmentType: job.type.toUpperCase().replace('-', '_') }),
    ...(job.salaryMin && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salaryCurrency || 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          ...(job.salaryMax && { maxValue: job.salaryMax }),
          unitText: 'YEAR',
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
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-map-pin" />
                {job.location}
              </span>
            )}
            {job.type && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {TYPE_LABELS[job.type] || job.type}
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
          <div
            className="prose prose-slate max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
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
