import { MetadataRoute } from 'next';
import { db } from '@repo/database-hirekit';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://app.hirekit.io';

  const companies = await db.company.findMany({
    where: {
      landingPage: { published: true },
    },
    select: {
      slug: true,
      updatedAt: true,
      jobs: {
        where: { active: true },
        select: { id: true, updatedAt: true },
      },
    },
  });

  const entries: MetadataRoute.Sitemap = [];

  for (const company of companies) {
    entries.push({
      url: `${baseUrl}/career/${company.slug}`,
      lastModified: company.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    for (const job of company.jobs) {
      entries.push({
        url: `${baseUrl}/career/${company.slug}/${job.id}`,
        lastModified: job.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
