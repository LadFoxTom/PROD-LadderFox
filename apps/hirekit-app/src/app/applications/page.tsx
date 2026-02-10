import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { DashboardLayout } from '@/app/components/DashboardLayout';

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const company = await db.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) redirect('/onboarding');

  const status = searchParams.status || 'all';
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { companyId: company.id };
  if (status !== 'all') where.status = status;

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { job: { select: { id: true, title: true } } },
    }),
    db.application.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statusOptions = ['all', 'new', 'reviewing', 'shortlisted', 'rejected'];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Applications</h2>
            <p className="text-[#64748B] text-[15px] mt-1">{total} total applications</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6">
          {statusOptions.map((s) => (
            <Link
              key={s}
              href={`/applications${s !== 'all' ? `?status=${s}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                status === s
                  ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph-users text-[#4F46E5] text-2xl" />
              </div>
              <p className="text-[#64748B] text-[15px]">
                {status === 'all'
                  ? 'No applications yet. Install the widget to start receiving CVs.'
                  : `No ${status} applications.`}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-[#FAFBFC]">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#FAFBFC] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/applications/${app.id}`}
                        className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                      >
                        {app.name || 'Unnamed'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {app.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {app.job?.title || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-[#64748B]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/applications?page=${page - 1}${status !== 'all' ? `&status=${status}` : ''}`}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/applications?page=${page + 1}${status !== 'all' ? `&status=${status}` : ''}`}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    new: { bg: '#E0E7FF', text: '#4F46E5' },
    reviewing: { bg: '#FEF3C7', text: '#D97706' },
    shortlisted: { bg: '#DCFCE7', text: '#16A34A' },
    rejected: { bg: '#FEE2E2', text: '#DC2626' },
  };
  const s = styles[status] || { bg: '#F1F5F9', text: '#64748B' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
