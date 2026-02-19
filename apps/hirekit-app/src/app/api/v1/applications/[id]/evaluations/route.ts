import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { logActivity } from '@/lib/activity';

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
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  // Verify application belongs to company and get job info
  const app = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    select: { id: true, jobId: true },
  });
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Fetch scorecard for this job (if any)
  let scorecard = null;
  if (app.jobId) {
    const job = await db.job.findUnique({
      where: { id: app.jobId },
      select: { scorecardId: true },
    });
    if (job?.scorecardId) {
      scorecard = await db.scorecard.findUnique({
        where: { id: job.scorecardId },
      });
    }
  }
  // Fallback: check for a company default scorecard
  if (!scorecard) {
    scorecard = await db.scorecard.findFirst({
      where: { companyId: ctx.companyId, isDefault: true },
    });
  }

  const evaluations = await db.evaluation.findMany({
    where: { applicationId: params.id },
    orderBy: { createdAt: 'desc' },
  });

  // Get user names
  const userIds = [...new Set(evaluations.map((e) => e.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

  return NextResponse.json({
    evaluations: evaluations.map((e) => ({
      ...e,
      userName: userMap[e.userId] || 'Unknown',
    })),
    currentUserId: session.user.id,
    scorecard: scorecard
      ? { id: scorecard.id, name: scorecard.name, criteria: scorecard.criteria }
      : null,
  });
}

export async function POST(
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

  const app = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    select: { id: true },
  });
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { rating, recommendation, notes, scores } = await request.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  const evaluation = await db.evaluation.upsert({
    where: {
      applicationId_userId: {
        applicationId: params.id,
        userId: session.user.id,
      },
    },
    create: {
      applicationId: params.id,
      userId: session.user.id,
      rating,
      recommendation: recommendation || null,
      notes: notes || null,
      scores: scores || null,
    },
    update: {
      rating,
      recommendation: recommendation || null,
      notes: notes || null,
      scores: scores || null,
    },
  });

  logActivity({
    companyId: ctx.companyId,
    applicationId: params.id,
    type: 'evaluation_added',
    data: { rating, recommendation },
    performedBy: session.user.id,
  });

  return NextResponse.json({ evaluation });
}
