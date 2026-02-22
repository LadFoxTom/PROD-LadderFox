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
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const job = await db.job.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: {
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}

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

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.requirements !== undefined) data.requirements = body.requirements || null;
  if (body.benefits !== undefined) data.benefits = body.benefits || null;
  if (body.benefitTags !== undefined) data.benefitTags = Array.isArray(body.benefitTags) ? body.benefitTags : [];
  if (body.city !== undefined) data.city = body.city || null;
  if (body.region !== undefined) data.region = body.region || null;
  if (body.country !== undefined) data.country = body.country || null;
  if (body.city !== undefined || body.region !== undefined || body.country !== undefined) {
    const city = body.city !== undefined ? body.city : undefined;
    const region = body.region !== undefined ? body.region : undefined;
    const country = body.country !== undefined ? body.country : undefined;
    data.location = [city, region, country].filter(Boolean).join(', ') || null;
  }
  if (body.type !== undefined) data.type = body.type || null;
  if (body.workplaceType !== undefined) data.workplaceType = body.workplaceType || null;
  if (body.employmentTypes !== undefined) data.employmentTypes = Array.isArray(body.employmentTypes) ? body.employmentTypes : [];
  if (body.experienceLevel !== undefined) data.experienceLevel = body.experienceLevel || null;
  if (body.department !== undefined) data.department = body.department || null;
  if (body.salaryMin !== undefined) data.salaryMin = body.salaryMin ? Number(body.salaryMin) : null;
  if (body.salaryMax !== undefined) data.salaryMax = body.salaryMax ? Number(body.salaryMax) : null;
  if (body.salaryCurrency !== undefined) data.salaryCurrency = body.salaryCurrency || 'EUR';
  if (body.salaryPeriod !== undefined) data.salaryPeriod = body.salaryPeriod || 'year';
  if (body.showSalary !== undefined) data.showSalary = Boolean(body.showSalary);
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.scorecardId !== undefined) data.scorecardId = body.scorecardId || null;
  if (body.screeningQuestions !== undefined) data.screeningQuestions = body.screeningQuestions ?? null;

  const result = await db.job.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data,
  });

  if (result.count === 0) {
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
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  // Soft delete by setting active to false
  const result = await db.job.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data: { active: false },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
