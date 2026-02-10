import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

// Dev-only endpoint to toggle widget type for testing
export async function POST(request: NextRequest) {
  const { companyId, widgetType } = await request.json();

  if (!companyId || !['form', 'chat'].includes(widgetType)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  await db.landingPage.updateMany({
    where: { companyId },
    data: { widgetType },
  });

  return NextResponse.json({ success: true, widgetType });
}
