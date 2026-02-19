import { db } from '@repo/database-hirekit';

type ActivityType = 'application_created' | 'status_change' | 'note_added' | 'ai_scored';

export function logActivity(params: {
  companyId: string;
  applicationId: string;
  type: ActivityType;
  data: Record<string, unknown>;
  performedBy?: string | null;
}) {
  // Fire-and-forget: non-blocking, errors silently caught
  db.activityLog.create({
    data: {
      companyId: params.companyId,
      applicationId: params.applicationId,
      type: params.type,
      data: params.data,
      performedBy: params.performedBy ?? null,
    },
  }).catch((err) => {
    console.error('[ActivityLog] Failed to log activity:', err);
  });
}
