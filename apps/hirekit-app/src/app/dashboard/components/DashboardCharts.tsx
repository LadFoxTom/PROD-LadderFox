'use client';

import Link from 'next/link';

export interface TrendData {
  date: string;
  count: number;
}

export interface PipelineData {
  status: string;
  count: number;
}

export interface TopJob {
  id: string;
  title: string;
  count: number;
}

export interface AnalyticsData {
  trend: TrendData[];
  pipeline: PipelineData[];
  topJobs: TopJob[];
}

const PIPELINE_COLORS: Record<string, string> = {
  new: '#4F46E5',
  screening: '#D97706',
  interviewing: '#2563EB',
  offered: '#7C3AED',
  hired: '#16A34A',
  rejected: '#DC2626',
};

function MiniBarChart({
  data,
  maxValue,
  color,
}: {
  data: number[];
  maxValue: number;
  color: string;
}) {
  return (
    <div className="flex items-end gap-[2px] h-24">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
          style={{
            height: maxValue > 0 ? `${Math.max((value / maxValue) * 100, 2)}%` : '2%',
            backgroundColor: value > 0 ? color : '#E2E8F0',
          }}
          title={`${value} applications`}
        />
      ))}
    </div>
  );
}

function PipelineBar({
  status,
  count,
  maxCount,
}: {
  status: string;
  count: number;
  maxCount: number;
}) {
  const color = PIPELINE_COLORS[status] || '#64748B';
  const width = maxCount > 0 ? Math.max((count / maxCount) * 100, 4) : 4;

  return (
    <Link
      href={`/applications?status=${status}`}
      className="flex items-center gap-3 group cursor-pointer"
    >
      <span className="text-sm text-[#64748B] w-24 text-right capitalize group-hover:text-[#1E293B] transition-colors">
        {status}
      </span>
      <div className="flex-1 bg-[#F1F5F9] rounded-full h-6 overflow-hidden group-hover:bg-[#E8ECF1] transition-colors">
        <div
          className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 group-hover:opacity-90"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          {count > 0 && (
            <span className="text-xs font-bold text-white">{count}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function DashboardCharts({ data }: { data: AnalyticsData }) {

  const trendMax = Math.max(...data.trend.map((t) => t.count), 1);
  const pipelineMax = Math.max(...data.pipeline.map((p) => p.count), 1);
  const totalApps = data.trend.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Applications Trend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1E293B]">Applications Trend</h3>
            <p className="text-sm text-[#64748B]">Last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1E293B]">{totalApps}</p>
            <p className="text-xs text-[#94A3B8]">total</p>
          </div>
        </div>
        <MiniBarChart
          data={data.trend.map((t) => t.count)}
          maxValue={trendMax}
          color="#4F46E5"
        />
        <div className="flex justify-between mt-2 text-xs text-[#94A3B8]">
          <span>{data.trend[0]?.date.slice(5)}</span>
          <span>{data.trend[data.trend.length - 1]?.date.slice(5)}</span>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#1E293B]">Pipeline</h3>
          <p className="text-sm text-[#64748B]">Current status distribution</p>
        </div>
        <div className="space-y-3">
          {data.pipeline.map((p) => (
            <PipelineBar
              key={p.status}
              status={p.status}
              count={p.count}
              maxCount={pipelineMax}
            />
          ))}
        </div>
      </div>

      {/* Top Jobs */}
      {data.topJobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#1E293B]">Top Jobs by Applications</h3>
            <p className="text-sm text-[#64748B]">Most popular open positions</p>
          </div>
          <div className="space-y-3">
            {data.topJobs.map((job) => {
              const maxJobCount = Math.max(...data.topJobs.map((j) => j.count), 1);
              const width = Math.max((job.count / maxJobCount) * 100, 8);
              return (
                <Link
                  key={job.id}
                  href={`/applications?jobId=${job.id}`}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="text-sm text-[#1E293B] font-medium w-48 truncate group-hover:text-[#4F46E5] transition-colors">
                    {job.title}
                  </span>
                  <div className="flex-1 bg-[#F1F5F9] rounded-full h-6 overflow-hidden group-hover:bg-[#E8ECF1] transition-colors">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 bg-[#4F46E5] transition-all duration-500 group-hover:opacity-90"
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-xs font-bold text-white">{job.count}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
