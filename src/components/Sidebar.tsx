import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  Building2,
  BarChart3,
  RefreshCw,
  BookOpen,
  Sparkles,
  Database,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export type NavView =
  | 'overview'
  | 'all-complaints'
  | 'new-complaint'
  | 'departments'
  | 'analytics'
  | 'pending-sync'
  | 'demo-guide';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  totalComplaints: number;
  criticalCount: number;
  pendingSyncCount: number;
  onLoadDemoData: () => void;
  onResetDemoData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mobileMenuOpen,
  onCloseMobileMenu,
  totalComplaints,
  criticalCount,
  pendingSyncCount,
  onLoadDemoData,
  onResetDemoData,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'all-complaints',
      label: 'All Complaints',
      icon: <Inbox className="w-5 h-5" />,
      badge: totalComplaints > 0 ? totalComplaints : undefined,
      badgeColor: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200',
    },
    {
      id: 'new-complaint',
      label: 'New Complaint',
      icon: <PlusCircle className="w-5 h-5" />,
      badge: 'Intake',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200',
    },
    {
      id: 'departments',
      label: 'Department Queues',
      icon: <Building2 className="w-5 h-5" />,
      badge: criticalCount > 0 ? `${criticalCount} Alert` : undefined,
      badgeColor: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold animate-pulse',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'pending-sync',
      label: 'Pending Sync',
      icon: <RefreshCw className="w-5 h-5" />,
      badge: pendingSyncCount > 0 ? pendingSyncCount : '0',
      badgeColor: pendingSyncCount > 0 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    },
    {
      id: 'demo-guide',
      label: 'About & Demo Guide',
      icon: <BookOpen className="w-5 h-5" />,
      badge: '2-Min',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300',
    },
  ];

  const handleNavClick = (viewId: NavView) => {
    onSelectView(viewId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={onCloseMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 sm:top-20 z-40 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-72 shrink-0 bg-white dark:bg-[#172033] border-r border-[#E2E8F0] dark:border-[#334155] transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1]">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-sm font-semibold'
                    : 'text-[#1E293B] dark:text-[#F1F5F9] hover:bg-teal-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-[#0F766E] dark:text-[#2DD4BF]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Demo Operations & Local Status Box */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-[#334155] space-y-3 bg-[#F8FAFC] dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1]">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
              <span>Offline Database</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
              ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={onLoadDemoData}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Load 25 Synthetic Records</span>
            </button>

            <button
              onClick={onResetDemoData}
              className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Records</span>
            </button>
          </div>

          <div className="pt-2 text-[10px] text-[#64748B] dark:text-slate-400 text-center leading-relaxed">
            Gujarat Metro Hacks 2026 | PS-07
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Decision Support Prototype
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
