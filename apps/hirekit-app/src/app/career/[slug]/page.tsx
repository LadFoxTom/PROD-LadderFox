import { notFound } from 'next/navigation';
import { db } from '@repo/database-hirekit';
import { Metadata } from 'next';
import { CAREER_TEMPLATES, ModernTemplate } from './components/CareerTemplates';

interface PageProps {
  params: { slug: string };
}

async function getCareerData(slug: string) {
  const company = await db.company.findFirst({
    where: { slug },
    include: {
      branding: true,
      landingPage: true,
      jobs: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!company || !company.landingPage?.published) return null;
  return company;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const company = await getCareerData(params.slug);
  if (!company) return {};

  const lp = company.landingPage!;
  const title = `${lp.title} | ${company.name}`;
  const description = lp.metaDescription || lp.subtitle || `View open positions at ${company.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(lp.socialImageUrl && { images: [{ url: lp.socialImageUrl }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CareerPage({ params }: PageProps) {
  const company = await getCareerData(params.slug);
  if (!company) notFound();

  const lp = company.landingPage!;
  const branding = company.branding || {
    primaryColor: '#4F46E5',
    secondaryColor: '#F8FAFC',
    logoUrl: null,
    fontFamily: 'Inter',
    showCompanyName: true,
    tagline: null,
  };

  const departments = [...new Set(company.jobs.map((j) => j.department || 'Other'))].sort();
  const templateId = lp.templateId || 'modern';
  const Template = CAREER_TEMPLATES[templateId] || ModernTemplate;

  // JSON-LD structured data for Google Jobs
  const jobPostings = company.jobs.map((job) => ({
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || '',
    datePosted: job.createdAt.toISOString().split('T')[0],
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      ...(branding.logoUrl && { logo: branding.logoUrl }),
    },
    ...((job.city || job.region || job.country) && {
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          ...(job.city && { addressLocality: job.city }),
          ...(job.region && { addressRegion: job.region }),
          ...(job.country && { addressCountry: job.country }),
        },
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
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jobPostings.length === 1
              ? jobPostings[0]
              : { '@context': 'https://schema.org', '@graph': jobPostings }
          ),
        }}
      />
      <Template
        company={{ name: company.name, slug: company.slug }}
        branding={branding}
        landingPage={{
          title: lp.title,
          subtitle: lp.subtitle,
          introText: lp.introText,
          heroImageUrl: lp.heroImageUrl,
        }}
        jobs={company.jobs}
        departments={departments}
      />
    </>
  );
}
