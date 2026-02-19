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

  const requests = await db.dataDeletionRequest.findMany({
    where: { companyId: ctx.companyId },
    orderBy: { requestedAt: 'desc' },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { companyId, email } = body;

  if (!companyId || !email) {
    return NextResponse.json({ error: 'companyId and email are required' }, { status: 400 });
  }

  const company = await db.company.findUnique({
    where: { id: companyId },
  });
  if (!company) {
    return NextResponse.json({ error: 'Invalid company' }, { status: 404 });
  }

  // Check for existing pending request
  const existing = await db.dataDeletionRequest.findFirst({
    where: { companyId, email, status: 'pending' },
  });
  if (existing) {
    return NextResponse.json({ message: 'Request already submitted' });
  }

  const req = await db.dataDeletionRequest.create({
    data: { companyId, email },
  });

  return NextResponse.json({ request: req }, { status: 201 });
}
