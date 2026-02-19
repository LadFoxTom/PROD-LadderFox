import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { logActivity } from '@/lib/activity';

const VALID_STATUSES = ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];

export async function PATCH(request: NextRequest) {
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

  const body = await request.json();
  const { applicationId, applicationIds, status } = body;

  // Support both single ID (kanban) and array (bulk actions)
  const ids: string[] = applicationIds
    ? applicationIds
    : applicationId
      ? [applicationId]
      : [];

  if (ids.length === 0 || !status) {
    return NextResponse.json({ error: 'Missing applicationId(s) or status' }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const result = await db.application.updateMany({
    where: { id: { in: ids }, companyId: company.id },
    data: { status },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Log activity for each updated application
  for (const id of ids) {
    logActivity({
      companyId: company.id,
      applicationId: id,
      type: 'status_change',
      data: { to: status },
      performedBy: session.user.id,
    });
  }

  return NextResponse.json({ success: true, updated: result.count });
}
