import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const scorecard = await db.scorecard.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
  });

  if (!scorecard) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ scorecard });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const body = await request.json();

  const updated = await db.scorecard.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.criteria !== undefined && { criteria: body.criteria }),
      ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  await db.scorecard.deleteMany({
    where: { id: params.id, companyId: ctx.companyId },
  });

  return NextResponse.json({ success: true });
}
