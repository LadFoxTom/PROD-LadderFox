import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  await db.branding.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      primaryColor: data.primaryColor,
    },
    update: {
      primaryColor: data.primaryColor,
    },
  });

  await db.cVTemplate.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      templateType: data.template,
      sections: data.sections,
    },
    update: {
      templateType: data.template,
      sections: data.sections,
    },
  });

  await db.landingPage.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      domain: `${company.slug}.hirekit.io`,
      title: `Apply at ${company.name}`,
      successMessage: 'Thank you! We received your application.',
    },
    update: {},
  });

  return NextResponse.json({ success: true, companyId: company.id });
}
