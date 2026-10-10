import React, { useState } from 'react';
import {
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  ServerOff,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Complaint } from '../types/complaint';
import {
  simulateSyncPendingRecords,
  getSyncLogs,
  exportComplaintsToCSV,
  downloadCSV,
  SyncLog,
} from '../utils/storage';

interface PendingSyncViewProps {
  complaints: Complaint[];
  onOpenComplaint: (complaint: Complaint) => void;
  onSyncCompleted: () => void;
}

export const PendingSyncView: React.FC<PendingSyncViewProps> = ({
  complaints,
  onOpenComplaint,
  onSyncCompleted,
}) => {
  const pendingRecords = complaints.filter((c) => c.pendingSync);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ count: number; timestamp: string } | null>(null);
  const syncLogs = getSyncLogs();

  const handleSimulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const res = simulateSyncPendingRecords();
      setSyncResult({
        count: res.syncedCount,
        timestamp: res.timestamp,
      });
      setSyncing(false);
      onSyncCompleted();
    }, 1200);
  };

  const handleExportPending = () => {
    const csvData = exportComplaintsToCSV(pendingRecords);
    const filename = `metro-saathi-pending-sync-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csvData, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
              Pending Synchronization Queue
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                pendingRecords.length > 0
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
              }`}
            >
              {pendingRecords.length} Pending
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
            Air-gapped transaction queue holding grievances awaiting local batch export or tunnel handshake.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportPending}
            disabled={pendingRecords.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#172033] text-xs font-semibold text-[#1E293B] dark:text-[#F1F5F9] hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Export Pending (CSV)</span>
          </button>

          <button
            onClick={handleSimulateSync}
            disabled={syncing || pendingRecords.length === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Simulating Handshake...' : 'Simulate Local Sync'}</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Box (Non-Negotiable Requirement 2 & 3.J) */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <ServerOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            Notice: Simulated Local Synchronization (Zero Remote Cloud Dependency)
          </div>
          <p className="text-[11px] leading-relaxed">
            In strict compliance with the Gujarat Metro Hackathon PS-07 air-gapped offline requirement, METRO SAATHI stores all complaint records inside local browser storage (SQLite/IndexedDB-compatible). Clicking <strong>&quot;Simulate Local Sync&quot;</strong> marks pending records as synchronized locally within this demonstration instance. No external server or remote network call is made.
          </p>
        </div>
      </div>

      {syncResult && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Simulated synchronization completed for <strong>{syncResult.count}</strong> records at{' '}
              {new Date(syncResult.timestamp).toLocaleTimeString()}. Records updated to local synced state.
            </span>
          </div>
          <button
            onClick={() => setSyncResult(null)}
            className="text-xs font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Records Table */}
      <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Records Awaiting Dispatch Handshake ({pendingRecords.length})
          </h3>
          <span className="text-[11px] text-slate-500">
            Export via CSV to carry by USB flash drive in tunnel stations
          </span>
        </div>

        {pendingRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Pending Grievances
            </h4>
            <p className="text-xs text-slate-500">
              All complaints in the local database are currently marked as synchronized. Submitting new complaints will queue them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#111827] text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">ID</th>
                  <th className="py-2.5 px-3.5">Narrative</th>
                  <th className="py-2.5 px-3.5">Station</th>
                  <th className="py-2.5 px-3.5">Department</th>
                  <th className="py-2.5 px-3.5">Urgency</th>
                  <th className="py-2.5 px-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                {pendingRecords.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onOpenComplaint(c)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <td className="py-2.5 px-3.5 font-mono font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                      {c.id}
                    </td>
                    <td className="py-2.5 px-3.5 max-w-sm truncate text-[#1E293B] dark:text-[#F1F5F9]">
                      {c.text}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                      {c.station}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                      {c.department}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.priority === 'Critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {c.urgencyScore} • {c.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline">
                        Review →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sync History Audit Trail */}
      {syncLogs.length > 0 && (
        <div className="bg-white dark:bg-[#172033] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Simulated Sync Audit Logs
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {syncLogs.map((log: SyncLog, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{log.notes}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
