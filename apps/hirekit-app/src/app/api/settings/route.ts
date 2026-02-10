import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
    include: {
      branding: true,
      cvTemplate: true,
      landingPage: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  return NextResponse.json({
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
    },
    branding: company.branding || {
      primaryColor: '#4F46E5',
      secondaryColor: '#F8FAFC',
      fontFamily: 'Inter',
      showCompanyName: true,
      logoUrl: null,
    },
    sections: company.cvTemplate?.sections || {
      personalInfo: { enabled: true },
      experience: { enabled: true, min: 1, max: 10 },
      education: { enabled: true, min: 0, max: 5 },
      skills: { enabled: true },
    },
    templateType: company.cvTemplate?.templateType || 'classic',
    landingPage: company.landingPage
      ? {
          successMessage: company.landingPage.successMessage,
          redirectUrl: company.landingPage.redirectUrl,
          widgetType: company.landingPage.widgetType || 'form',
        }
      : {
          successMessage: 'Thank you! Your application has been submitted.',
          redirectUrl: null,
          widgetType: 'form',
        },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const body = await request.json();

  if (body.branding) {
    await db.branding.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        primaryColor: body.branding.primaryColor || '#4F46E5',
        secondaryColor: body.branding.secondaryColor || '#F8FAFC',
        fontFamily: body.branding.fontFamily || 'Inter',
        showCompanyName: body.branding.showCompanyName ?? true,
        logoUrl: body.branding.logoUrl || null,
      },
      update: {
        primaryColor: body.branding.primaryColor,
        secondaryColor: body.branding.secondaryColor,
        fontFamily: body.branding.fontFamily,
        showCompanyName: body.branding.showCompanyName,
        logoUrl: body.branding.logoUrl,
      },
    });
  }

  if (body.sections || body.templateType) {
    await db.cVTemplate.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        sections: body.sections || {
          personalInfo: { enabled: true },
          experience: { enabled: true, min: 1, max: 10 },
          education: { enabled: true, min: 0, max: 5 },
          skills: { enabled: true },
        },
        templateType: body.templateType || 'classic',
      },
      update: {
        ...(body.sections && { sections: body.sections }),
        ...(body.templateType && { templateType: body.templateType }),
      },
    });
  }

  if (body.landingPage) {
    await db.landingPage.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        domain: `${company.slug}.hirekit.io`,
        title: `Apply at ${company.name}`,
        successMessage: body.landingPage.successMessage || 'Thank you! Your application has been submitted.',
        redirectUrl: body.landingPage.redirectUrl || null,
        widgetType: body.landingPage.widgetType || 'form',
      },
      update: {
        successMessage: body.landingPage.successMessage,
        redirectUrl: body.landingPage.redirectUrl,
        ...(body.landingPage.widgetType && { widgetType: body.landingPage.widgetType }),
      },
    });
  }

  return NextResponse.json({ success: true });
}
