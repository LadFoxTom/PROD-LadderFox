import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { processDataDeletion } from '@/lib/gdpr';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { action, notes } = body;

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
  }

  const req = await db.dataDeletionRequest.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
  });
  if (!req) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
  }

  if (action === 'approve') {
    await processDataDeletion(ctx.companyId, req.email);
  }

  const updated = await db.dataDeletionRequest.update({
    where: { id: params.id },
    data: {
      status: action === 'approve' ? 'completed' : 'rejected',
      processedAt: new Date(),
      processedBy: session.user.id,
      notes: notes || null,
    },
  });

  return NextResponse.json({ request: updated });
}
