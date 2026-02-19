import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { StatusBadge } from '@/app/components/StatusBadge';
import { JobActions } from './JobActions';

export default async function JobDetailPage({
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
    include: {
      applications: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });
  if (!job) notFound();

  const applicationCount = await db.application.count({
    where: { jobId: job.id },
  });

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const currency = job.salaryCurrency || 'EUR';
    const fmt = (n: number) =>
      new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}`;
    if (job.salaryMin) return `From ${fmt(job.salaryMin)}`;
    return `Up to ${fmt(job.salaryMax!)}`;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            <i className="ph ph-arrow-left" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#1E293B]">{job.title}</h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        job.active
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {job.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3">
                    {job.department && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-buildings" />
                        {job.department}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-map-pin" />
                        {job.location}
                      </span>
                    )}
                    {job.type && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-clock" />
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </span>
                    )}
                    {formatSalary() && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-money" />
                        {formatSalary()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="px-4 py-2 bg-white text-[#4F46E5] border border-[#4F46E5] rounded-xl font-semibold text-sm hover:bg-[#4F46E5] hover:text-white transition-all duration-300"
                  >
                    Edit
                  </Link>
                  <JobActions jobId={job.id} active={job.active} />
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <i className="ph ph-file-text text-xl text-[#4F46E5]" />
                  <h3 className="text-lg font-bold text-[#1E293B]">Description</h3>
                </div>
                <p className="text-[#1E293B] text-[15px] leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            )}

            {/* Applications */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1E293B]">
                  Applications ({applicationCount})
                </h3>
                {applicationCount > 0 && (
                  <Link
                    href={`/applications?jobId=${job.id}`}
                    className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                  >
                    View all
                  </Link>
                )}
              </div>
              {job.applications.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#64748B] text-[15px]">
                    No applications for this job yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {job.applications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="flex items-center justify-between px-8 py-4 hover:bg-[#FAFBFC] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {(app.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E293B]">
                            {app.name || 'Unnamed Applicant'}
                          </p>
                          <p className="text-sm text-[#94A3B8]">{app.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={app.status} />
                        <span className="text-xs text-[#94A3B8]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Meta */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Overview</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[#94A3B8]">Applications</dt>
                  <dd className="font-bold text-2xl text-[#1E293B] mt-0.5">
                    {applicationCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">Status</dt>
                  <dd className="font-medium text-[#1E293B] mt-0.5">
                    {job.active ? 'Active' : 'Inactive'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">Created</dt>
                  <dd className="font-medium text-[#1E293B] mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">Last Updated</dt>
                  <dd className="font-medium text-[#1E293B] mt-0.5">
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">Job ID</dt>
                  <dd className="font-mono text-xs text-[#94A3B8] mt-0.5">
                    {job.id}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
