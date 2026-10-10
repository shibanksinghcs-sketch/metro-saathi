import { Complaint, ComplaintCategory, ComplaintSource } from '../types/complaint';
import { getGeneratedSyntheticComplaints } from '../data/syntheticComplaints';
import { classifyComplaint } from './nlpClassifier';

const STORAGE_KEY = 'metro_saathi_complaints_v1';
const SYNC_LOG_KEY = 'metro_saathi_sync_logs_v1';
const LAST_ID_KEY = 'metro_saathi_last_seq_v1';

export interface SyncLog {
  timestamp: string;
  count: number;
  type: 'manual_simulated' | 'csv_import';
  notes: string;
}

// Generate human-friendly stable ID
export function generateNextComplaintId(): string {
  try {
    const raw = localStorage.getItem(LAST_ID_KEY);
    let seq = raw ? parseInt(raw, 10) : 1030;
    seq += 1;
    localStorage.setItem(LAST_ID_KEY, seq.toString());
    return `GMRC-2026-${seq}`;
  } catch {
    const fallback = Math.floor(1000 + Math.random() * 9000);
    return `GMRC-2026-${fallback}`;
  }
}

// Retrieve all complaints from local persistent storage
export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: Complaint[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading complaints from localStorage:', err);
    return [];
  }
}

// Save all complaints to local persistent storage
export function saveStoredComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error('Error saving complaints to localStorage:', err);
  }
}

// Add a single new complaint (marked as pendingSync: true)
export function addComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'pendingSync' | 'isSynthetic'>): Complaint {
  const all = getStoredComplaints();
  const id = generateNextComplaintId();
  const now = new Date().toISOString();

  const fullComplaint: Complaint = {
    ...complaint,
    id,
    createdAt: now,
    updatedAt: now,
    isSynthetic: false,
    pendingSync: true,
  };

  all.unshift(fullComplaint);
  saveStoredComplaints(all);
  return fullComplaint;
}

// Update existing complaint
export function updateComplaint(updated: Complaint): void {
  const all = getStoredComplaints();
  const idx = all.findIndex((c) => c.id === updated.id);
  if (idx !== -1) {
    all[idx] = {
      ...updated,
      updatedAt: new Date().toISOString(),
      pendingSync: true, // Mark changes as needing sync
    };
    saveStoredComplaints(all);
  }
}

// Delete complaint
export function deleteComplaint(id: string): void {
  const all = getStoredComplaints();
  const filtered = all.filter((c) => c.id !== id);
  saveStoredComplaints(filtered);
}

// Load Synthetic Demo Data without duplicate insertion
export function loadSyntheticDemoData(): { added: number; total: number } {
  const existing = getStoredComplaints();
  const existingIds = new Set(existing.map((c) => c.id));
  const syntheticList = getGeneratedSyntheticComplaints();

  const toAdd = syntheticList.filter((item) => !existingIds.has(item.id));
  const combined = [...existing, ...toAdd];
  saveStoredComplaints(combined);

  return {
    added: toAdd.length,
    total: combined.length,
  };
}

// Reset Demo Data safely without deleting real user-entered complaints
export function resetSyntheticDemoData(): { removed: number; userRemaining: number } {
  const existing = getStoredComplaints();
  const userEntered = existing.filter((c) => !c.isSynthetic);
  saveStoredComplaints(userEntered);

  return {
    removed: existing.length - userEntered.length,
    userRemaining: userEntered.length,
  };
}

// Reset everything to zero
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SYNC_LOG_KEY);
  localStorage.removeItem(LAST_ID_KEY);
}

// Simulate synchronization for pending records
export function simulateSyncPendingRecords(): { syncedCount: number; timestamp: string } {
  const all = getStoredComplaints();
  let count = 0;
  const now = new Date().toISOString();

  const updated = all.map((c) => {
    if (c.pendingSync) {
      count++;
      return {
        ...c,
        pendingSync: false,
        syncedAt: now,
      };
    }
    return c;
  });

  saveStoredComplaints(updated);

  // Record audit log
  const rawLogs = localStorage.getItem(SYNC_LOG_KEY);
  const logs: SyncLog[] = rawLogs ? JSON.parse(rawLogs) : [];
  logs.unshift({
    timestamp: now,
    count,
    type: 'manual_simulated',
    notes: `Simulated local synchronization of ${count} pending grievance records.`,
  });
  localStorage.setItem(SYNC_LOG_KEY, JSON.stringify(logs.slice(0, 20)));

  return {
    syncedCount: count,
    timestamp: now,
  };
}

// Get sync logs
export function getSyncLogs(): SyncLog[] {
  try {
    const raw = localStorage.getItem(SYNC_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Export complaints to CSV string
export function exportComplaintsToCSV(complaints: Complaint[]): string {
  if (complaints.length === 0) {
    return 'id,text,station,source,language,category,department,urgency_score,priority,status,passenger_contact,pending_sync,created_at\n';
  }

  const headers = [
    'Complaint ID',
    'Complaint Text',
    'Station',
    'Source',
    'Detected Language',
    'Category',
    'Assigned Department',
    'Urgency Score',
    'Priority',
    'Status',
    'Passenger Contact',
    'Pending Sync',
    'Is Synthetic',
    'Recommended Action',
    'Created At',
  ];

  const escapeCSV = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = complaints.map((c) => [
    escapeCSV(c.id),
    escapeCSV(c.text),
    escapeCSV(c.station),
    escapeCSV(c.source),
    escapeCSV(c.detectedLanguage),
    escapeCSV(c.category),
    escapeCSV(c.department),
    escapeCSV(c.urgencyScore),
    escapeCSV(c.priority),
    escapeCSV(c.status),
    escapeCSV(c.passengerContact || ''),
    escapeCSV(c.pendingSync ? 'YES' : 'NO'),
    escapeCSV(c.isSynthetic ? 'YES' : 'NO'),
    escapeCSV(c.recommendedAction),
    escapeCSV(c.createdAt),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// Download CSV file to passenger/operator system
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Bulk CSV Import parser and processor
export interface CSVImportResult {
  totalProcessed: number;
  successCount: number;
  criticalCount: number;
  errors: string[];
}

export function importComplaintsFromCSV(csvText: string): CSVImportResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      totalProcessed: 0,
      successCount: 0,
      criticalCount: 0,
      errors: ['CSV file is empty or missing headers.'],
    };
  }

  const rawHeaders = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
  
  // Find column index for text
  let textIdx = rawHeaders.findIndex((h) =>
    h.includes('text') || h.includes('complaint') || h.includes('description') || h.includes('issue')
  );
  if (textIdx === -1) textIdx = 0; // fallback

  const stationIdx = rawHeaders.findIndex((h) => h.includes('station'));
  const sourceIdx = rawHeaders.findIndex((h) => h.includes('source'));
  const langIdx = rawHeaders.findIndex((h) => h.includes('lang'));
  const contactIdx = rawHeaders.findIndex((h) => h.includes('contact') || h.includes('phone') || h.includes('email'));
  const categoryIdx = rawHeaders.findIndex((h) => h.includes('category'));

  const complaintsToAdd: Complaint[] = [];
  const errors: string[] = [];
  let criticalCount = 0;

  // Simple CSV line parser respecting quotes
  const parseCSVLine = (textLine: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < textLine.length; i++) {
      const c = textLine[i];
      if (c === '"') {
        if (inQuotes && textLine[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const complaintText = row[textIdx]?.replace(/^["']|["']$/g, '').trim();

    if (!complaintText) {
      errors.push(`Row ${i + 1}: Empty complaint text skipped.`);
      continue;
    }

    const station = stationIdx !== -1 && row[stationIdx] ? row[stationIdx] : 'Gujarat Metro';
    const source = (sourceIdx !== -1 && row[sourceIdx] ? row[sourceIdx] : 'App') as ComplaintSource;
    const manualLang = langIdx !== -1 ? row[langIdx] : undefined;
    const manualCategory = (categoryIdx !== -1 && row[categoryIdx] ? row[categoryIdx] : undefined) as ComplaintCategory | undefined;
    const contact = contactIdx !== -1 ? row[contactIdx] : 'Bulk CSV Import';

    const classified = classifyComplaint(complaintText, station, manualLang, manualCategory);
    if (classified.priority === 'Critical') {
      criticalCount++;
    }

    const id = generateNextComplaintId();
    const now = new Date().toISOString();

    complaintsToAdd.push({
      id,
      text: complaintText,
      source: (['App', 'Email', 'Social Media', 'Paper', 'Helpdesk', 'Other'].includes(source) ? source : 'Other') as ComplaintSource,
      station,
      language: manualLang || 'Auto-detect',
      detectedLanguage: classified.detectedLanguage,
      category: classified.category,
      department: classified.department,
      urgencyScore: classified.urgencyScore,
      priority: classified.priority,
      reasons: classified.reasons,
      recommendedAction: classified.recommendedAction,
      responseDraft: classified.responseDraft,
      status: 'Open',
      internalNotes: 'Imported via Bulk CSV Intake.',
      passengerContact: contact,
      createdAt: now,
      updatedAt: now,
      isSynthetic: false,
      pendingSync: true,
    });
  }

  const existing = getStoredComplaints();
  saveStoredComplaints([...complaintsToAdd, ...existing]);

  return {
    totalProcessed: lines.length - 1,
    successCount: complaintsToAdd.length,
    criticalCount,
    errors,
  };
}
