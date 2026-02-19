import Link from 'next/link';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    location: string | null;
    type: string | null;
    department: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    createdAt: Date;
  };
  slug: string;
  primaryColor: string;
}

const TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

export function JobCard({ job, slug, primaryColor }: JobCardProps) {
  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()} ${job.salaryCurrency || 'EUR'}`
      : job.salaryMin
        ? `From ${job.salaryMin.toLocaleString()} ${job.salaryCurrency || 'EUR'}`
        : null;

  return (
    <Link
      href={`/career/${slug}/${job.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold group-hover:opacity-80 transition-opacity"
            style={{ color: primaryColor }}
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <i className="ph ph-map-pin text-xs" />
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-1">
                <i className="ph ph-clock text-xs" />
                {TYPE_LABELS[job.type] || job.type}
              </span>
            )}
            {job.department && (
              <span className="flex items-center gap-1">
                <i className="ph ph-buildings text-xs" />
                {job.department}
              </span>
            )}
            {salary && (
              <span className="flex items-center gap-1">
                <i className="ph ph-currency-circle-dollar text-xs" />
                {salary}
              </span>
            )}
          </div>
        </div>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
        >
          <i className="ph ph-arrow-right text-sm" />
        </div>
      </div>
    </Link>
  );
}
