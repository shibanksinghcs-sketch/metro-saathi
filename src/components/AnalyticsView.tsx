import React from 'react';
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Languages,
  Radio,
  Building,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Complaint } from '../types/complaint';

interface AnalyticsViewProps {
  complaints: Complaint[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ complaints }) => {
  const total = complaints.length;

  // 1. Category Distribution
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // 2. Urgency Distribution
  const urgencyCounts = {
    Critical: complaints.filter((c) => c.priority === 'Critical').length,
    High: complaints.filter((c) => c.priority === 'High').length,
    Medium: complaints.filter((c) => c.priority === 'Medium').length,
    Low: complaints.filter((c) => c.priority === 'Low').length,
  };

  // 3. Status Distribution
  const statusCounts = {
    Open: complaints.filter((c) => c.status === 'Open').length,
    'In Progress': complaints.filter((c) => c.status === 'In Progress').length,
    Resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  // 4. Language Distribution
  const languageCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    languageCounts[c.detectedLanguage] = (languageCounts[c.detectedLanguage] || 0) + 1;
  });

  // 5. Source Distribution
  const sourceCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1;
  });

  // 6. Top Stations
  const stationCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    stationCounts[c.station] = (stationCounts[c.station] || 0) + 1;
  });
  const topStations = Object.entries(stationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-12 text-center space-y-3">
        <BarChart2 className="w-12 h-12 mx-auto text-slate-400" />
        <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
          No Analytics Data Available
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Load synthetic records or ingest passenger grievances to generate visual distribution charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
          Grievance Intelligence Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
          Air-gapped offline data intelligence generated from local SQLite-mode records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Horizontal Bar SVG) */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Grievance Volume by Category
            </h3>
          </div>

          <div className="space-y-2.5">
            {Object.entries(categoryCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => {
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1E293B] dark:text-[#F1F5F9] truncate">{cat}</span>
                      <span className="text-[#64748B] dark:text-[#CBD5E1]">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Urgency Distribution (Color Coded Segments) */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Urgency Score Distribution (0–100)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Critical */}
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 block">Critical (80-100)</span>
              <div className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">
                {urgencyCounts.Critical}
              </div>
              <span className="text-[10px] text-red-500">
                {Math.round((urgencyCounts.Critical / total) * 100)}% of total
              </span>
            </div>

            {/* High */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">High (60-79)</span>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                {urgencyCounts.High}
              </div>
              <span className="text-[10px] text-amber-500">
                {Math.round((urgencyCounts.High / total) * 100)}% of total
              </span>
            </div>

            {/* Medium */}
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60">
              <span className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] block">Medium (30-59)</span>
              <div className="text-2xl font-black text-teal-800 dark:text-teal-200 mt-1">
                {urgencyCounts.Medium}
              </div>
              <span className="text-[10px] text-teal-600">
                {Math.round((urgencyCounts.Medium / total) * 100)}% of total
              </span>
            </div>

            {/* Low */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-[#334155]">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Low (0-29)</span>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                {urgencyCounts.Low}
              </div>
              <span className="text-[10px] text-slate-500">
                {Math.round((urgencyCounts.Low / total) * 100)}% of total
              </span>
            </div>
          </div>

          {/* Cumulative Urgency Progress Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            <div
              className="bg-red-500"
              style={{ width: `${(urgencyCounts.Critical / total) * 100}%` }}
              title="Critical"
            />
            <div
              className="bg-amber-400"
              style={{ width: `${(urgencyCounts.High / total) * 100}%` }}
              title="High"
            />
            <div
              className="bg-teal-500"
              style={{ width: `${(urgencyCounts.Medium / total) * 100}%` }}
              title="Medium"
            />
            <div
              className="bg-slate-400"
              style={{ width: `${(urgencyCounts.Low / total) * 100}%` }}
              title="Low"
            />
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Multilingual Grievance Intake Ratio
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(languageCounts).map(([lang, count]) => {
              const percent = Math.round((count / total) * 100);
              return (
                <div key={lang} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#1E293B] dark:text-[#F1F5F9]">
                      {lang === 'Gujarati'
                        ? 'Gujarati (ગુજરાતી)'
                        : lang === 'Hindi'
                        ? 'Hindi (हिंदी)'
                        : lang === 'Gujlish'
                        ? 'Gujlish (Transliterated)'
                        : lang}
                    </span>
                    <span className="text-[#64748B] dark:text-[#CBD5E1]">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F766E] dark:bg-[#2DD4BF] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Channels & Resolution Status */}
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Channel Distribution & Resolution Rate
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 block font-bold">Open</span>
              <span className="text-xl font-bold text-amber-800 dark:text-amber-200">{statusCounts.Open}</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
              <span className="text-[10px] text-sky-700 dark:text-sky-300 block font-bold">In Progress</span>
              <span className="text-xl font-bold text-sky-800 dark:text-sky-200">{statusCounts['In Progress']}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">Resolved</span>
              <span className="text-xl font-bold text-[#15803D] dark:text-[#4ADE80]">{statusCounts.Resolved}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
              Grievance Sources:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(sourceCounts).map(([src, count]) => (
                <span
                  key={src}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {src}: <strong className="text-slate-900 dark:text-white">{count}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Stations Grievance Frequency */}
      <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Building className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
          <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Station Grievance Heatmap (Top Stations)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topStations.map(([stn, count]) => (
            <div
              key={stn}
              className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#334155] text-center"
            >
              <div className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] truncate">
                {stn}
              </div>
              <div className="text-lg font-black text-[#0F766E] dark:text-[#2DD4BF] mt-0.5">
                {count}
              </div>
              <span className="text-[10px] text-slate-500">records</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
