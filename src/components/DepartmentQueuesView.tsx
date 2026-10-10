import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  CreditCard,
  Accessibility,
  Wrench,
  Users,
  Info,
  LifeBuoy,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Complaint, Department } from '../types/complaint';

interface DepartmentQueuesViewProps {
  complaints: Complaint[];
  onSelectDepartment: (dept: string) => void;
  onOpenComplaint: (complaint: Complaint) => void;
}

interface DeptConfig {
  name: Department;
  icon: React.ReactNode;
  description: string;
  slaTarget: string;
}

const DEPARTMENTS_CONFIG: DeptConfig[] = [
  {
    name: 'Safety and Security',
    icon: <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />,
    description: 'Police liaison, platform security, fire safety, crime & emergency response.',
    slaTarget: '< 15 mins for Critical',
  },
  {
    name: 'Housekeeping',
    icon: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    description: 'Station hygiene, sanitation, coach cleanliness, washrooms & waste management.',
    slaTarget: '< 1 hour for Spills',
  },
  {
    name: 'Ticketing and Revenue',
    icon: <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    description: 'Automated fare gates, smartcards, UPI deductions, token vending machines & refunds.',
    slaTarget: '24-48 hours resolution',
  },
  {
    name: 'Station Maintenance and Accessibility',
    icon: <Accessibility className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    description: 'Lifts, wheelchairs, Divyang passenger ramps, tactile guidance & station infrastructure.',
    slaTarget: 'Immediate for Entrapment',
  },
  {
    name: 'Station Maintenance',
    icon: <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    description: 'Escalators, station lighting, HVAC chillers, electrical boards & power systems.',
    slaTarget: '< 2 hours for Escalators',
  },
  {
    name: 'Customer Relations',
    icon: <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    description: 'Staff conduct, passenger feedback, ticketing counter etiquette & personnel training.',
    slaTarget: '24 hours review',
  },
  {
    name: 'Passenger Support',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    description: 'Train frequency, timetable inquiries, audio announcements, digital signage & route maps.',
    slaTarget: 'Same day update',
  },
  {
    name: 'General Support',
    icon: <LifeBuoy className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    description: 'Ambiguous queries, lost and found, inter-agency coordination & triage reviews.',
    slaTarget: 'Standard review',
  },
];

export const DepartmentQueuesView: React.FC<DepartmentQueuesViewProps> = ({
  complaints,
  onSelectDepartment,
  onOpenComplaint,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
          Department Dispatch Queues
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
          Dedicated operational queues mapped to Gujarat Metro administrative teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEPARTMENTS_CONFIG.map((dept) => {
          const deptComplaints = complaints.filter((c) => c.department === dept.name);
          const totalCount = deptComplaints.length;
          const criticalCount = deptComplaints.filter((c) => c.priority === 'Critical').length;
          const openCount = deptComplaints.filter((c) => c.status === 'Open').length;
          const inProgressCount = deptComplaints.filter((c) => c.status === 'In Progress').length;
          const resolvedCount = deptComplaints.filter((c) => c.status === 'Resolved').length;

          return (
            <div
              key={dept.name}
              className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs flex flex-col justify-between hover:border-teal-400 dark:hover:border-teal-500 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B]">
                    {dept.icon}
                  </div>
                  {criticalCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold animate-pulse">
                      {criticalCount} Critical
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      SLA: {dept.slaTarget}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9] line-clamp-1">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] line-clamp-2 mt-0.5">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 dark:bg-[#0B1220] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Open</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{openCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0B1220] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Active</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{inProgressCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0B1220] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Done</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{resolvedCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectDepartment(dept.name)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-[#0F766E] dark:text-[#2DD4BF] text-xs font-bold transition-colors"
                >
                  <span>Open Queue ({totalCount})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
