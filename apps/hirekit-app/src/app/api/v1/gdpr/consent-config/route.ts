import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const config = await db.consentConfig.findUnique({
    where: { companyId: ctx.companyId },
  });

  return NextResponse.json({
    config: config || {
      enabled: false,
      consentText: 'I consent to the processing of my personal data for recruitment purposes.',
      privacyPolicyUrl: null,
      retentionDays: 365,
    },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { enabled, consentText, privacyPolicyUrl, retentionDays } = body;

  if (!consentText || typeof consentText !== 'string') {
    return NextResponse.json({ error: 'Consent text is required' }, { status: 400 });
  }

  const config = await db.consentConfig.upsert({
    where: { companyId: ctx.companyId },
    create: {
      companyId: ctx.companyId,
      enabled: Boolean(enabled),
      consentText,
      privacyPolicyUrl: privacyPolicyUrl || null,
      retentionDays: retentionDays || 365,
    },
    update: {
      enabled: Boolean(enabled),
      consentText,
      privacyPolicyUrl: privacyPolicyUrl || null,
      retentionDays: retentionDays || 365,
    },
  });

  return NextResponse.json({ config });
}
