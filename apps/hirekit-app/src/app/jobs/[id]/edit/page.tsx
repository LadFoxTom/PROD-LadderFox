import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { JobForm } from '../../components/JobForm';

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) redirect('/onboarding');

  const job = await db.job.findFirst({
    where: { id: params.id, companyId: company.id },
  });
  if (!job) notFound();

  const scorecards = await db.scorecard.findMany({
    where: { companyId: company.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            <i className="ph ph-arrow-left" />
            Back to Job
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E293B]">Edit Job</h2>
          <p className="text-[#64748B] text-[15px] mt-1">{job.title}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-3xl">
          <JobForm
            mode="edit"
            jobId={job.id}
            scorecards={scorecards}
            initialData={{
              title: job.title,
              description: job.description || '',
              location: job.location || '',
              type: job.type || '',
              department: job.department || '',
              salaryMin: job.salaryMin?.toString() || '',
              salaryMax: job.salaryMax?.toString() || '',
              salaryCurrency: job.salaryCurrency || 'EUR',
              scorecardId: job.scorecardId || '',
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
