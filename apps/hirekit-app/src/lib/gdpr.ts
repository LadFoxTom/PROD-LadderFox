import { db } from '@repo/database-hirekit';

export async function processDataDeletion(companyId: string, email: string) {
  // Delete applications and related data
  const applications = await db.application.findMany({
    where: { companyId, email },
    select: { id: true },
  });

  const applicationIds = applications.map((a) => a.id);

  if (applicationIds.length > 0) {
    // Delete evaluations
    await db.evaluation.deleteMany({
      where: { applicationId: { in: applicationIds } },
    });

    // Delete candidate consents
    await db.candidateConsent.deleteMany({
      where: { companyId, email },
    });

    // Delete applications
    await db.application.deleteMany({
      where: { companyId, email },
    });
  }

  return { deletedApplications: applicationIds.length };
}

export async function exportCandidateData(companyId: string, email: string) {
  const applications = await db.application.findMany({
    where: { companyId, email },
    include: {
      job: { select: { id: true, title: true } },
    },
  });

  const applicationIds = applications.map((a) => a.id);

  const evaluations = applicationIds.length > 0
    ? await db.evaluation.findMany({
        where: { applicationId: { in: applicationIds } },
      })
    : [];

  const consents = await db.candidateConsent.findMany({
    where: { companyId, email },
  });

  return {
    email,
    applications: applications.map((a) => ({
      id: a.id,
      job: a.job?.title || null,
      status: a.status,
      cvData: a.cvData,
      source: a.source,
      createdAt: a.createdAt,
    })),
    evaluations: evaluations.map((e) => ({
      id: e.id,
      applicationId: e.applicationId,
      rating: e.rating,
      recommendation: e.recommendation,
      notes: e.notes,
      createdAt: e.createdAt,
    })),
    consents: consents.map((c) => ({
      id: c.id,
      consentText: c.consentText,
      consentedAt: c.consentedAt,
      ipAddress: c.ipAddress,
    })),
    exportedAt: new Date().toISOString(),
  };
}
