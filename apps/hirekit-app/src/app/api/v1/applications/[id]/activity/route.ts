import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  // Verify application belongs to company
  const application = await db.application.findFirst({
    where: { id: params.id, companyId: company.id },
    select: { id: true },
  });
  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const activities = await db.activityLog.findMany({
    where: { applicationId: params.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ activities });
}
