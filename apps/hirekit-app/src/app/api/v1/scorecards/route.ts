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
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const scorecards = await db.scorecard.findMany({
    where: { companyId: ctx.companyId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ scorecards });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const body = await request.json();
  if (!body.name || !body.criteria || !Array.isArray(body.criteria)) {
    return NextResponse.json({ error: 'Name and criteria are required' }, { status: 400 });
  }

  const scorecard = await db.scorecard.create({
    data: {
      companyId: ctx.companyId,
      name: body.name,
      criteria: body.criteria,
      isDefault: body.isDefault ?? false,
    },
  });

  return NextResponse.json({ scorecard }, { status: 201 });
}
