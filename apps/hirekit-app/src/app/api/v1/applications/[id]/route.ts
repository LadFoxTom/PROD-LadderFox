import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { logActivity } from '@/lib/activity';

const VALID_STATUSES = ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];

export async function PATCH(
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

  const body = await request.json();

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const application = await db.application.updateMany({
    where: { id: params.id, companyId: company.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });

  if (application.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (body.status) {
    logActivity({
      companyId: company.id,
      applicationId: params.id,
      type: 'status_change',
      data: { to: body.status },
      performedBy: session.user.id,
    });
  }
  if (body.notes !== undefined) {
    logActivity({
      companyId: company.id,
      applicationId: params.id,
      type: 'note_added',
      data: { notes: typeof body.notes === 'string' ? body.notes.substring(0, 200) : '' },
      performedBy: session.user.id,
    });
  }

  return NextResponse.json({ success: true });
}

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

  const application = await db.application.findFirst({
    where: { id: params.id, companyId: company.id },
    include: { job: true },
  });

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(application);
}
