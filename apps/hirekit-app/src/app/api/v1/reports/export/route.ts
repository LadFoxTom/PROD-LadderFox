import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get('days') || '30', 10);
  const status = searchParams.get('status');
  const jobId = searchParams.get('jobId');

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const where: Record<string, unknown> = {
    companyId: ctx.companyId,
    createdAt: { gte: fromDate },
  };
  if (status && status !== 'all') where.status = status;
  if (jobId) where.jobId = jobId;

  const applications = await db.application.findMany({
    where,
    include: { job: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Build CSV
  const headers = ['Name', 'Email', 'Phone', 'Job', 'Status', 'AI Score', 'Source', 'Applied', 'Hired At'];
  const rows = applications.map((app) => [
    csvEscape(app.name || ''),
    csvEscape(app.email),
    csvEscape(app.phone || ''),
    csvEscape(app.job?.title || 'No Job'),
    app.status,
    app.aiScore?.toString() || '',
    app.source || '',
    app.createdAt.toISOString().split('T')[0],
    app.hiredAt ? app.hiredAt.toISOString().split('T')[0] : '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applications-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
