import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavView } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { AllComplaintsView } from './components/AllComplaintsView';
import { NewComplaintView } from './components/NewComplaintView';
import { DepartmentQueuesView } from './components/DepartmentQueuesView';
import { AnalyticsView } from './components/AnalyticsView';
import { PendingSyncView } from './components/PendingSyncView';
import { DemoGuideView } from './components/DemoGuideView';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import {
  Complaint,
  ComplaintStatus,
} from './types/complaint';
import {
  getStoredComplaints,
  loadSyntheticDemoData,
  resetSyntheticDemoData,
  updateComplaint,
  deleteComplaint,
} from './utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state persisted in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('metro_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('metro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('metro_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Data & View state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentView, setCurrentView] = useState<NavView>('overview');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load complaints on mount
  const refreshComplaints = useCallback(() => {
    const list = getStoredComplaints();
    setComplaints(list);
  }, []);

  useEffect(() => {
    refreshComplaints();
  }, [refreshComplaints]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Actions
  const handleLoadDemoData = () => {
    const res = loadSyntheticDemoData();
    refreshComplaints();
    showToast(`Loaded ${res.added} synthetic demonstration grievances.`);
  };

  const handleResetDemoData = () => {
    const res = resetSyntheticDemoData();
    refreshComplaints();
    showToast(`Reset ${res.removed} synthetic records. Preserved user records.`);
  };

  const handleComplaintCreated = (newC: Complaint) => {
    refreshComplaints();
    showToast(`Grievance ${newC.id} registered & dispatched!`);
  };

  const handleUpdateStatus = (complaint: Complaint, newStatus: ComplaintStatus) => {
    const updated = { ...complaint, status: newStatus };
    updateComplaint(updated);
    refreshComplaints();
    showToast(`Grievance ${complaint.id} status changed to ${newStatus}.`);
  };

  const handleSaveModalComplaint = (updated: Complaint) => {
    updateComplaint(updated);
    refreshComplaints();
    showToast(`Grievance ${updated.id} updated successfully.`);
  };

  const handleDeleteComplaint = (id: string) => {
    deleteComplaint(id);
    refreshComplaints();
    showToast(`Grievance ${id} deleted.`);
  };

  const handleSelectDepartmentQueue = (deptName: string) => {
    setDepartmentFilter(deptName);
    setCurrentView('all-complaints');
  };

  const pendingSyncCount = complaints.filter((c) => c.pendingSync).length;
  const criticalCount = complaints.filter((c) => c.priority === 'Critical').length;

  return (
    <div className="min-h-screen bg-[#F4F8FA] dark:bg-[#0B1220] text-[#1E293B] dark:text-[#F1F5F9] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => {
            if (view === 'all-complaints') {
              setDepartmentFilter('all');
            }
            setCurrentView(view);
          }}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          totalComplaints={complaints.length}
          criticalCount={criticalCount}
          pendingSyncCount={pendingSyncCount}
          onLoadDemoData={handleLoadDemoData}
          onResetDemoData={handleResetDemoData}
        />

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentView === 'overview' && (
            <OverviewView
              complaints={complaints}
              onOpenComplaint={setSelectedComplaint}
              onNavigate={(v) => setCurrentView(v)}
              onLoadDemoData={handleLoadDemoData}
            />
          )}

          {currentView === 'all-complaints' && (
            <AllComplaintsView
              complaints={complaints}
              onOpenComplaint={setSelectedComplaint}
              onUpdateStatus={handleUpdateStatus}
              initialDepartmentFilter={departmentFilter}
            />
          )}

          {currentView === 'new-complaint' && (
            <NewComplaintView
              onComplaintCreated={handleComplaintCreated}
              onNavigateToAll={() => setCurrentView('all-complaints')}
            />
          )}

          {currentView === 'departments' && (
            <DepartmentQueuesView
              complaints={complaints}
              onSelectDepartment={handleSelectDepartmentQueue}
              onOpenComplaint={setSelectedComplaint}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView complaints={complaints} />
          )}

          {currentView === 'pending-sync' && (
            <PendingSyncView
              complaints={complaints}
              onOpenComplaint={setSelectedComplaint}
              onSyncCompleted={() => {
                refreshComplaints();
                showToast('Local simulated synchronization completed.');
              }}
            />
          )}

          {currentView === 'demo-guide' && (
            <DemoGuideView
              onNavigate={(v) => setCurrentView(v)}
              onLoadDemoData={handleLoadDemoData}
              totalComplaints={complaints.length}
            />
          )}
        </main>
      </div>

      {/* Detail / Inspection Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSave={handleSaveModalComplaint}
          onDelete={handleDeleteComplaint}
        />
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F766E] text-white shadow-xl text-xs sm:text-sm font-bold border border-teal-400 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
