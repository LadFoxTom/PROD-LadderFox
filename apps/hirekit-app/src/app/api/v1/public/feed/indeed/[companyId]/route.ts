import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

const JOB_TYPE_MAP: Record<string, string> = {
  'full-time': 'fulltime',
  'part-time': 'parttime',
  'contract': 'contract',
  'internship': 'internship',
  'freelance': 'contract',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const company = await db.company.findUnique({
    where: { id: params.companyId },
    include: {
      landingPage: true,
      jobs: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!company) {
    return new NextResponse('Company not found', { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://app.hirekit.io';

  const jobsXml = company.jobs.map((job) => {
    const location = job.location || '';
    const parts = location.split(',').map(s => s.trim());
    const city = parts[0] || '';
    const country = parts.length > 1 ? parts[parts.length - 1] : '';

    let salary = '';
    if (job.salaryMin && job.salaryMax) {
      salary = `${job.salaryMin}-${job.salaryMax} ${job.salaryCurrency || 'EUR'}`;
    } else if (job.salaryMin) {
      salary = `From ${job.salaryMin} ${job.salaryCurrency || 'EUR'}`;
    }

    const jobType = job.type ? (JOB_TYPE_MAP[job.type] || job.type) : '';

    return `  <job>
    <title><![CDATA[${job.title}]]></title>
    <date><![CDATA[${job.createdAt.toUTCString()}]]></date>
    <referencenumber>${job.id}</referencenumber>
    <url><![CDATA[${baseUrl}/career/${company.slug}/${job.id}]]></url>
    <company><![CDATA[${company.name}]]></company>
    <city><![CDATA[${city}]]></city>
    <country><![CDATA[${country}]]></country>
    <description><![CDATA[${job.description || ''}]]></description>${salary ? `\n    <salary><![CDATA[${salary}]]></salary>` : ''}${jobType ? `\n    <jobtype><![CDATA[${jobType}]]></jobtype>` : ''}
  </job>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher><![CDATA[${company.name}]]></publisher>
  <publisherurl><![CDATA[${baseUrl}/career/${company.slug}]]></publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${jobsXml}
</source>`;

  const isDev = process.env.NODE_ENV !== 'production';
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': isDev
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=3600, stale-while-revalidate=1800',
    },
  });
}
