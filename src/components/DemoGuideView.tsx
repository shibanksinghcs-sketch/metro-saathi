import React from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Database,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Languages,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { NavView } from './Sidebar';

interface DemoGuideViewProps {
  onNavigate: (view: NavView) => void;
  onLoadDemoData: () => void;
  totalComplaints: number;
}

export const DemoGuideView: React.FC<DemoGuideViewProps> = ({
  onNavigate,
  onLoadDemoData,
  totalComplaints,
}) => {
  const demoSteps = [
    {
      num: 1,
      title: 'Inspect Offline Command Dashboard',
      description: 'Observe real-time local KPIs calculated directly from stored SQLite records with zero cloud calls.',
      actionText: 'View Overview',
      action: () => onNavigate('overview'),
    },
    {
      num: 2,
      title: 'Load 25+ Realistic Synthetic Grievances',
      description: 'Populate the local database with multi-lingual complaints covering Gujarati, Hindi, English, and Gujlish.',
      actionText: 'Load Demo Records',
      action: onLoadDemoData,
    },
    {
      num: 3,
      title: 'Inspect Department Dispatch Queues',
      description: 'Review SLA indicators, workload counts, and priority dispatches across all 8 Gujarat Metro departments.',
      actionText: 'View Department Queues',
      action: () => onNavigate('departments'),
    },
    {
      num: 4,
      title: 'Test Live Intake with Gujarati / Hindi / Gujlish',
      description: 'Test live input with preset critical cases (e.g. lift stuck with elderly, smoke hazard, or UPI fare deduction).',
      actionText: 'Go to Intake Form',
      action: () => onNavigate('new-complaint'),
    },
    {
      num: 5,
      title: 'Inspect Explainable Urgency Scoring (0–100)',
      description: 'Examine transparent point breakdown, matched danger keywords, and recommended operational protocols.',
      actionText: 'Open Intake Intelligence',
      action: () => onNavigate('new-complaint'),
    },
    {
      num: 6,
      title: 'Preview & Edit Multilingual Response Drafts',
      description: 'Switch response drafts between Gujarati, Hindi, and English. Edit and copy with one click.',
      actionText: 'Test Response Drafts',
      action: () => onNavigate('new-complaint'),
    },
    {
      num: 7,
      title: 'Update Complaint Status & Internal Notes',
      description: 'Dispatch tickets through lifecycle: Open → In Progress → Resolved. Add supervisor investigation notes.',
      actionText: 'Manage Grievances',
      action: () => onNavigate('all-complaints'),
    },
    {
      num: 8,
      title: 'Filter & Export Full CSV Dataset',
      description: 'Filter by category, urgency, language, or station and download local CSV with zero cloud dependence.',
      actionText: 'Export Grievance CSV',
      action: () => onNavigate('all-complaints'),
    },
    {
      num: 9,
      title: 'Audit Pending Synchronization Queue',
      description: 'Inspect air-gapped queue holding changes and click "Simulate Local Sync" to mark them synced.',
      actionText: 'Open Pending Sync',
      action: () => onNavigate('pending-sync'),
    },
    {
      num: 10,
      title: 'Verify Offline Independence',
      description: 'Turn off your Wi-Fi or mobile data completely. The entire application continues functioning flawlessly.',
      actionText: 'Check Offline Badge',
      action: () => onNavigate('overview'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-900 to-[#0F766E] p-6 text-white shadow-md">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
          <Award className="w-4 h-4 text-amber-300" />
          <span>Gujarat Metro Hacks | Problem Statement PS-07</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">
          METRO SAATHI — 2-Minute Judge Walkthrough
        </h2>
        <p className="text-teal-100 text-sm max-w-2xl mt-1.5 leading-relaxed">
          <strong>PS-07: Every Complaint Heard.</strong> An air-gapped Passenger Grievance Intelligence system designed for high-stress transport operations. Deterministic local NLP, explainable scoring, human-in-the-loop overrides, and zero internet dependencies.
        </p>
      </div>

      {/* 10-Step Walkthrough Grid */}
      <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9] flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span>Interactive 2-Minute Demonstration Flow</span>
          </h3>
          <span className="text-xs text-slate-500">
            {totalComplaints} records loaded locally
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {demoSteps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between space-y-3 hover:border-teal-400 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9]">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] pl-8 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pl-8 pt-1">
                <button
                  onClick={step.action}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] hover:underline"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical AI & Decision-Support Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Decision Support, Not Autonomous Action</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
            METRO SAATHI is purposefully engineered as a <strong>human-in-the-loop decision-support tool</strong>. High-urgency indicators (smoke, entrapment, harassment) raise immediate visual alerts for station controllers, but do not automatically contact emergency services without verified human validation.
          </p>
        </div>

        <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <WifiOff className="w-5 h-5" />
            <span>Air-Gapped Offline Engineering</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
            No remote LLM API calls, no CDN stylesheets, no online fonts, and no third-party tracking. All multilingual parsing, tokenization, urgency weighting, and data persistence run purely in local client memory and local storage.
          </p>
        </div>
      </div>
    </div>
  );
};
