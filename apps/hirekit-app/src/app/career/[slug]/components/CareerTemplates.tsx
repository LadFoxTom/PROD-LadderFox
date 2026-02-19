import { JobCard } from './JobCard';

interface CareerTemplateProps {
  company: {
    name: string;
    slug: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string | null;
    fontFamily: string;
    showCompanyName: boolean;
    tagline: string | null;
  };
  landingPage: {
    title: string;
    subtitle: string | null;
    introText: string | null;
    heroImageUrl: string | null;
  };
  jobs: Array<{
    id: string;
    title: string;
    location: string | null;
    type: string | null;
    department: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    createdAt: Date;
  }>;
  departments: string[];
}

export function ModernTemplate({ company, branding, landingPage, jobs, departments }: CareerTemplateProps) {
  return (
    <div style={{ fontFamily: branding.fontFamily }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.primaryColor}CC 100%)`,
        }}
      >
        {landingPage.heroImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${landingPage.heroImageUrl})` }}
          />
        )}
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={company.name} className="h-12 mx-auto mb-6" />
          )}
          {!branding.logoUrl && branding.showCompanyName && (
            <h2 className="text-lg font-medium text-white/80 mb-2">{company.name}</h2>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{landingPage.title}</h1>
          {landingPage.subtitle && (
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{landingPage.subtitle}</p>
          )}
        </div>
      </div>

      {/* Intro */}
      {landingPage.introText && (
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-lg text-slate-600 leading-relaxed">{landingPage.introText}</p>
        </div>
      )}

      {/* Jobs */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Open Positions
            <span className="text-slate-400 text-lg font-normal ml-2">({jobs.length})</span>
          </h2>
        </div>

        {departments.length > 1 ? (
          departments.map((dept) => {
            const deptJobs = jobs.filter((j) => (j.department || 'Other') === dept);
            if (deptJobs.length === 0) return null;
            return (
              <div key={dept} className="mb-10">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  {dept}
                </h3>
                <div className="space-y-3">
                  {deptJobs.map((job) => (
                    <JobCard key={job.id} job={job} slug={company.slug} primaryColor={branding.primaryColor} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} slug={company.slug} primaryColor={branding.primaryColor} />
            ))}
          </div>
        )}

        {jobs.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${branding.primaryColor}15` }}
            >
              <i className="ph ph-briefcase text-2xl" style={{ color: branding.primaryColor }} />
            </div>
            <p className="text-slate-500 text-lg">No open positions at the moment.</p>
            <p className="text-slate-400 mt-1">Check back later for new opportunities.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} {company.name}. Powered by HireKit.</p>
      </div>
    </div>
  );
}

export function MinimalTemplate({ company, branding, landingPage, jobs, departments }: CareerTemplateProps) {
  return (
    <div style={{ fontFamily: branding.fontFamily }}>
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-8">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={company.name} className="h-8" />
          )}
          {branding.showCompanyName && (
            <span className="text-lg font-semibold text-slate-900">{company.name}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{landingPage.title}</h1>
        {landingPage.subtitle && (
          <p className="text-lg text-slate-500">{landingPage.subtitle}</p>
        )}
        {landingPage.introText && (
          <p className="text-slate-600 mt-4 leading-relaxed">{landingPage.introText}</p>
        )}
      </div>

      {/* Jobs */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <p className="text-sm text-slate-400 mb-6">{jobs.length} open position{jobs.length !== 1 ? 's' : ''}</p>
        <div className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={`/career/${company.slug}/${job.id}`}
              className="flex items-center justify-between py-5 hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium text-slate-900">{job.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  {job.location && <span>{job.location}</span>}
                  {job.type && <span>{job.type}</span>}
                  {job.department && <span>{job.department}</span>}
                </div>
              </div>
              <i className="ph ph-arrow-right text-slate-400" />
            </a>
          ))}
        </div>

        {jobs.length === 0 && (
          <p className="text-slate-400 py-8">No open positions right now.</p>
        )}
      </div>

      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        Powered by HireKit
      </div>
    </div>
  );
}

export function CorporateTemplate({ company, branding, landingPage, jobs, departments }: CareerTemplateProps) {
  return (
    <div style={{ fontFamily: branding.fontFamily }} className="bg-slate-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.logoUrl && (
              <img src={branding.logoUrl} alt={company.name} className="h-8" />
            )}
            {branding.showCompanyName && (
              <span className="font-bold text-slate-900">{company.name}</span>
            )}
          </div>
          <span className="text-sm text-slate-500">Careers</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{landingPage.title}</h1>
            {landingPage.subtitle && (
              <p className="text-xl text-slate-600">{landingPage.subtitle}</p>
            )}
            {landingPage.introText && (
              <p className="text-slate-500 mt-6 leading-relaxed">{landingPage.introText}</p>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">{jobs.length} Open Roles</h2>
        </div>

        {departments.length > 1 ? (
          departments.map((dept) => {
            const deptJobs = jobs.filter((j) => (j.department || 'Other') === dept);
            if (deptJobs.length === 0) return null;
            return (
              <div key={dept} className="mb-10">
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                  style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
                >
                  {dept}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {deptJobs.map((job) => (
                    <JobCard key={job.id} job={job} slug={company.slug} primaryColor={branding.primaryColor} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} slug={company.slug} primaryColor={branding.primaryColor} />
            ))}
          </div>
        )}

        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">No open positions at this time.</p>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} {company.name}
      </footer>
    </div>
  );
}

export function CreativeTemplate({ company, branding, landingPage, jobs, departments }: CareerTemplateProps) {
  return (
    <div style={{ fontFamily: branding.fontFamily }}>
      {/* Hero with gradient border */}
      <div className="relative">
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${branding.primaryColor}, ${branding.primaryColor}80, ${branding.primaryColor}40)` }}
        />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center gap-4 mb-8">
            {branding.logoUrl && (
              <img src={branding.logoUrl} alt={company.name} className="h-10" />
            )}
            {branding.showCompanyName && (
              <span className="text-2xl font-bold" style={{ color: branding.primaryColor }}>
                {company.name}
              </span>
            )}
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-4">
            {landingPage.title}
          </h1>
          {landingPage.subtitle && (
            <p className="text-xl text-slate-500 max-w-2xl">{landingPage.subtitle}</p>
          )}
          {landingPage.introText && (
            <p className="text-slate-600 mt-6 max-w-2xl leading-relaxed">{landingPage.introText}</p>
          )}
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
          style={{ backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor }}
        >
          <i className="ph ph-briefcase" />
          {jobs.length} open position{jobs.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} slug={company.slug} primaryColor={branding.primaryColor} />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-300 font-bold">No open roles yet</p>
          </div>
        )}
      </div>

      <div
        className="py-8 text-center text-sm text-white/70"
        style={{ backgroundColor: branding.primaryColor }}
      >
        &copy; {new Date().getFullYear()} {company.name} &middot; Powered by HireKit
      </div>
    </div>
  );
}

export const CAREER_TEMPLATES: Record<string, React.FC<CareerTemplateProps>> = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  creative: CreativeTemplate,
};
