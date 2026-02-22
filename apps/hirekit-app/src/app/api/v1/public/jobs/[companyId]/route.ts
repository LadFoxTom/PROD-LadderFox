import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;

  const company = await db.company.findUnique({
    where: { id: companyId },
    include: {
      branding: true,
      jobListingConfig: true,
      jobs: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          benefits: true,
          benefitTags: true,
          location: true,
          city: true,
          region: true,
          country: true,
          type: true,
          workplaceType: true,
          employmentTypes: true,
          experienceLevel: true,
          department: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          salaryPeriod: true,
          showSalary: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const jobListingConfig: Record<string, any> = {
    templateId: company.jobListingConfig?.templateId || 'simple',
    showFilters: company.jobListingConfig?.showFilters ?? true,
    showSearch: company.jobListingConfig?.showSearch ?? true,
  };

  // Include custom template fields only when using custom template
  if (jobListingConfig.templateId === 'custom' && company.jobListingConfig) {
    jobListingConfig.customCSS = company.jobListingConfig.customTemplateCSS || null;
    jobListingConfig.customFontUrl = company.jobListingConfig.customFontUrl || null;
    jobListingConfig.customLayout = company.jobListingConfig.customLayout || null;
  }

  const response = NextResponse.json({
    company: {
      name: company.name,
      logo: company.branding?.logoUrl || null,
      primaryColor: company.branding?.primaryColor || '#4F46E5',
    },
    jobListingConfig,
    jobs: company.jobs,
  });

  const isDev = process.env.NODE_ENV !== 'production';
  response.headers.set('Cache-Control', isDev
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=60, stale-while-revalidate=300'
  );

  return response;
}
