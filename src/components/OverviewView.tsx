import React from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  Building2,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { Complaint, ComplaintCategory, Department } from '../types/complaint';

interface OverviewViewProps {
  complaints: Complaint[];
  onOpenComplaint: (complaint: Complaint) => void;
  onNavigate: (view: any) => void;
  onLoadDemoData: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  complaints,
  onOpenComplaint,
  onNavigate,
  onLoadDemoData,
}) => {
  // Metrics calculated directly from real stored records
  const total = complaints.length;
  const critical = complaints.filter((c) => c.priority === 'Critical').length;
  const open = complaints.filter((c) => c.status === 'Open').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const pendingSync = complaints.filter((c) => c.pendingSync).length;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Department workload
  const departmentCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    departmentCounts[c.department] = (departmentCounts[c.department] || 0) + 1;
  });

  // Recent high-priority or critical complaints
  const highPriorityComplaints = complaints
    .filter((c) => c.priority === 'Critical' || c.priority === 'High')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#115E59] via-[#0F766E] to-[#14B8A6] p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>Gujarat Metro Grievance Command</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Passenger Grievance Intelligence
            </h2>
            <p className="text-teal-100 text-sm max-w-xl mt-1">
              Offline triage and decision-support for Gujarati, Hindi, English, and Gujlish passenger complaints across Ahmedabad and Surat Metro networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('new-complaint')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-[#0F766E] hover:bg-teal-50 font-bold text-sm shadow-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#0F766E]" />
              <span>Intake New Complaint</span>
            </button>
            {total === 0 && (
              <button
                onClick={onLoadDemoData}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-sm border border-teal-500/40 transition-colors"
              >
                <span>Load 25 Synthetic Complaints</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs hover:border-teal-400 dark:hover:border-teal-500 transition-colors">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#1E293B] dark:text-[#F1F5F9]">{total}</span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">All channels</span>
          </div>
        </div>

        {/* Critical Awaiting Review */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border-2 border-red-200 dark:border-red-900/60 shadow-xs hover:border-red-500 transition-colors bg-red-50/30 dark:bg-red-950/20">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400">
            <span className="text-xs font-bold uppercase tracking-wider">Critical</span>
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 animate-bounce" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400">{critical}</span>
            <span className="text-[11px] font-semibold text-red-600/80 dark:text-red-300">Action req.</span>
          </div>
        </div>

        {/* Open */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
            <span className="text-xs font-semibold uppercase tracking-wider">Open</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{open}</span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">In triage</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">{inProgress}</span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">Assigned</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#15803D] dark:text-[#4ADE80]">{resolved}</span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">
              {total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Pending Sync */}
        <div className="bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Sync</span>
            <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300">{pendingSync}</span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">Local queue</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Category Distribution & Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
              <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Top Grievance Categories
              </h3>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#64748B] dark:text-slate-400">
              No complaint records stored yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {topCategories.map(([category, count]) => {
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1E293B] dark:text-[#F1F5F9]">{category}</span>
                      <span className="text-[#64748B] dark:text-[#CBD5E1]">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Department Workload */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
              <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Department Dispatch Queues
              </h3>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center"
            >
              View All Queues <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {Object.entries(departmentCounts).slice(0, 6).map(([dept, count]) => (
              <div
                key={dept}
                onClick={() => onNavigate('departments')}
                className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] cursor-pointer hover:border-teal-400 transition-colors"
              >
                <div className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1] truncate">
                  {dept}
                </div>
                <div className="text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9] mt-0.5">
                  {count} <span className="text-xs font-normal text-slate-500">tickets</span>
                </div>
              </div>
            ))}
            {Object.keys(departmentCounts).length === 0 && (
              <div className="col-span-2 text-center py-6 text-sm text-[#64748B] dark:text-slate-400">
                No active department dispatches.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High Priority Grievances Table */}
      <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                High-Priority Complaints Requiring Verification
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                Urgent grievances flagged by offline deterministic scoring for human supervisor review.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('all-complaints')}
            className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center"
          >
            All Grievances ({total}) <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {highPriorityComplaints.length === 0 ? (
          <div className="text-center py-10 bg-[#F8FAFC] dark:bg-[#111827] rounded-xl border border-dashed border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-medium text-[#64748B] dark:text-slate-400">
              No high-priority or critical complaints logged.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;Load 25 Synthetic Records&quot; or submit a new grievance to see triage in action.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
            {highPriorityComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenComplaint(c)}
                className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-teal-50/40 dark:hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                      {c.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'Critical'
                          ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      Score: {c.urgencyScore}/100 • {c.priority}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.station}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300">
                      {c.category}
                    </span>
                  </div>

                  <p className="text-sm text-[#1E293B] dark:text-[#F1F5F9] font-medium line-clamp-2">
                    {c.text}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : c.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold flex items-center">
                    Review <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
