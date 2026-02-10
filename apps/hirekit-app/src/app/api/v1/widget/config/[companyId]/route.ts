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
      cvTemplate: true,
      landingPage: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  return NextResponse.json({
    branding: company.branding
      ? {
          primaryColor: company.branding.primaryColor,
          secondaryColor: company.branding.secondaryColor,
          logo: company.branding.logoUrl,
          companyName: company.name,
          fontFamily: company.branding.fontFamily,
          showCompanyName: company.branding.showCompanyName,
        }
      : {
          primaryColor: '#4F46E5',
          companyName: company.name,
          showCompanyName: true,
        },
    sections: company.cvTemplate?.sections ?? {
      personalInfo: { enabled: true },
      experience: { enabled: true, min: 1 },
      education: { enabled: true },
      skills: { enabled: true },
    },
    widgetType: company.landingPage?.widgetType || 'form',
    templateType: company.cvTemplate?.templateType || 'classic',
    landingPage: company.landingPage
      ? {
          successMessage: company.landingPage.successMessage,
          redirectUrl: company.landingPage.redirectUrl,
        }
      : null,
  });
}
