import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const config = await db.consentConfig.findUnique({
    where: { companyId: params.companyId },
  });

  if (!config || !config.enabled) {
    return NextResponse.json({ enabled: false });
  }

  return NextResponse.json({
    enabled: true,
    consentText: config.consentText,
    privacyPolicyUrl: config.privacyPolicyUrl,
  });
}
