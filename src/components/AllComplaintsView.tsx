import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Complaint, ComplaintStatus, FilterOptions } from '../types/complaint';
import { exportComplaintsToCSV, downloadCSV } from '../utils/storage';

interface AllComplaintsViewProps {
  complaints: Complaint[];
  onOpenComplaint: (complaint: Complaint) => void;
  onUpdateStatus: (complaint: Complaint, newStatus: ComplaintStatus) => void;
  initialDepartmentFilter?: string;
}

export const AllComplaintsView: React.FC<AllComplaintsViewProps> = ({
  complaints,
  onOpenComplaint,
  onUpdateStatus,
  initialDepartmentFilter = 'all',
}) => {
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>(initialDepartmentFilter);
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgency_desc' | 'urgency_asc'>('newest');
  
  // View mode: 'table' or 'cards' (defaults to cards on mobile)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = c.text.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesStation = c.station.toLowerCase().includes(q);
        const matchesContact = c.passengerContact?.toLowerCase().includes(q);
        if (!matchesText && !matchesId && !matchesStation && !matchesContact) {
          return false;
        }
      }

      // Category
      if (categoryFilter !== 'all' && c.category !== categoryFilter) {
        return false;
      }

      // Department
      if (departmentFilter !== 'all' && c.department !== departmentFilter) {
        return false;
      }

      // Urgency
      if (urgencyFilter !== 'all' && c.priority !== urgencyFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      // Language
      if (languageFilter !== 'all' && c.detectedLanguage !== languageFilter) {
        return false;
      }

      // Source
      if (sourceFilter !== 'all' && c.source !== sourceFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'urgency_desc') {
        return b.urgencyScore - a.urgencyScore;
      }
      if (sortBy === 'urgency_asc') {
        return a.urgencyScore - b.urgencyScore;
      }
      return 0;
    });
  }, [
    complaints,
    searchQuery,
    categoryFilter,
    departmentFilter,
    urgencyFilter,
    statusFilter,
    languageFilter,
    sourceFilter,
    sortBy,
  ]);

  const handleExportCSV = () => {
    const csvData = exportComplaintsToCSV(filteredComplaints);
    const filename = `metro-saathi-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csvData, filename);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setDepartmentFilter('all');
    setUrgencyFilter('all');
    setStatusFilter('all');
    setLanguageFilter('all');
    setSourceFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-4">
      {/* View Header with Search, View Toggle & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
              All Passenger Grievances
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold">
              {filteredComplaints.length} of {complaints.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
            Comprehensive offline registry with multi-criteria filtering and status dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-[#E2E8F0] dark:border-[#334155] p-0.5 bg-white dark:bg-[#172033]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md ${
                viewMode === 'cards'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Collapse Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#172033] text-xs font-semibold text-[#1E293B] dark:text-[#F1F5F9] hover:bg-slate-50"
          >
            <Filter className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Filters</span>
          </button>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Complaint ID (e.g. GMRC-2026-1001), station, keywords in Gujarati, Hindi or English..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#172033] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter drawer / bar */}
      <div
        className={`bg-white dark:bg-[#172033] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-3 ${
          filtersOpen ? 'block' : 'hidden sm:block'
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="all">All Categories</option>
              <option value="Safety & Security">Safety & Security</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Fare & Payments">Fare & Payments</option>
              <option value="Lift & Accessibility">Lift & Accessibility</option>
              <option value="Escalator">Escalator</option>
              <option value="Staff Behaviour">Staff Behaviour</option>
              <option value="Service & Information">Service & Information</option>
              <option value="Other / Needs Review">Other / Needs Review</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="all">All Departments</option>
              <option value="Safety and Security">Safety and Security</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Ticketing and Revenue">Ticketing and Revenue</option>
              <option value="Station Maintenance and Accessibility">Station Maintenance & Access</option>
              <option value="Station Maintenance">Station Maintenance</option>
              <option value="Customer Relations">Customer Relations</option>
              <option value="Passenger Support">Passenger Support</option>
              <option value="General Support">General Support</option>
            </select>
          </div>

          {/* Urgency */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Urgency
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="all">All Urgencies</option>
              <option value="Critical">Critical (80-100)</option>
              <option value="High">High (60-79)</option>
              <option value="Medium">Medium (30-59)</option>
              <option value="Low">Low (0-29)</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Language
            </label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="all">All Languages</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="English">English</option>
              <option value="Gujlish">Gujlish</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgency_desc">Highest Urgency</option>
              <option value="urgency_asc">Lowest Urgency</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Complaints List / Table */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            No matching complaints found
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] max-w-sm mx-auto">
            Try adjusting your search terms or clearing filters to see all grievance records.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] text-xs font-bold"
          >
            Clear Active Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#CBD5E1] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3.5">ID / Date</th>
                  <th className="py-3 px-3.5">Complaint Narrative</th>
                  <th className="py-3 px-3.5">Station & Lang</th>
                  <th className="py-3 px-3.5">Department</th>
                  <th className="py-3 px-3.5">Urgency Score</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-teal-50/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onOpenComplaint(c)}
                  >
                    {/* ID & Date */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                        {c.id}
                      </div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      {c.isSynthetic && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Demo
                        </span>
                      )}
                    </td>

                    {/* Complaint Text */}
                    <td className="py-3 px-3.5 max-w-xs sm:max-w-md">
                      <p className="font-medium text-[#1E293B] dark:text-[#F1F5F9] line-clamp-2">
                        {c.text}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-300">
                          {c.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[10px] text-slate-500">{c.source}</span>
                      </div>
                    </td>

                    {/* Station & Lang */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                        {c.station}
                      </div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-semibold">
                        {c.detectedLanguage}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {c.department}
                      </span>
                    </td>

                    {/* Urgency Score */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          c.priority === 'Critical'
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                            : c.priority === 'High'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200'
                        }`}
                      >
                        <span>{c.urgencyScore}</span>
                        <span className="text-[10px] font-normal">({c.priority})</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={(e) => onUpdateStatus(c, e.target.value as ComplaintStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                            : c.status === 'In Progress'
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 text-sky-800 dark:text-sky-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenComplaint(c);
                        }}
                        className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-[#2DD4BF] hover:bg-teal-100 transition-colors"
                        title="View Full Grievance Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View (Mobile/Touch Optimized) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenComplaint(c)}
              className="bg-white dark:bg-[#172033] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs hover:border-teal-400 transition-colors cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                    {c.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.priority === 'Critical'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : c.priority === 'High'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                    }`}
                  >
                    Score: {c.urgencyScore} • {c.priority}
                  </span>
                </div>

                <p className="text-xs font-medium text-[#1E293B] dark:text-[#F1F5F9] line-clamp-3">
                  {c.text}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {c.station}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-medium">
                    {c.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {c.detectedLanguage}
                  </span>
                </div>
              </div>

              <div
                className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={c.status}
                  onChange={(e) => onUpdateStatus(c, e.target.value as ComplaintStatus)}
                  className="text-xs font-semibold px-2 py-1 rounded-lg border bg-white dark:bg-[#0B1220]"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  onClick={() => onOpenComplaint(c)}
                  className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-bold hover:underline"
                >
                  Inspect & Draft →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
