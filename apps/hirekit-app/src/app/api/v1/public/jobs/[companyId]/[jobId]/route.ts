import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string; jobId: string } }
) {
  const { companyId, jobId } = params;

  const job = await db.job.findFirst({
    where: { id: jobId, companyId, active: true },
    select: {
      id: true,
      screeningQuestions: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const response = NextResponse.json({
    screeningQuestions: job.screeningQuestions || [],
  });

  const isDev = process.env.NODE_ENV !== 'production';
  response.headers.set('Cache-Control', isDev
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=60, stale-while-revalidate=300'
  );

  return response;
}
