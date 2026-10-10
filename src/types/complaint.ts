export type ComplaintCategory =
  | 'Safety & Security'
  | 'Cleanliness'
  | 'Fare & Payments'
  | 'Lift & Accessibility'
  | 'Escalator'
  | 'Staff Behaviour'
  | 'Service & Information'
  | 'Other / Needs Review';

export type Department =
  | 'Safety and Security'
  | 'Housekeeping'
  | 'Ticketing and Revenue'
  | 'Station Maintenance and Accessibility'
  | 'Station Maintenance'
  | 'Customer Relations'
  | 'Passenger Support'
  | 'General Support';

export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

export type ComplaintSource =
  | 'App'
  | 'Email'
  | 'Social Media'
  | 'Paper'
  | 'Helpdesk'
  | 'Other';

export type ComplaintLanguage =
  | 'Auto-detect'
  | 'Gujarati'
  | 'Hindi'
  | 'English'
  | 'Gujlish'
  | 'Other';

export interface ScoringReason {
  rule: string;
  points: number;
  description: string;
  matchedTerms?: string[];
}

export interface ClassificationResult {
  category: ComplaintCategory;
  department: Department;
  urgencyScore: number;
  priority: UrgencyLevel;
  detectedLanguage: 'Gujarati' | 'Hindi' | 'English' | 'Gujlish' | 'Other';
  confidence: number;
  reasons: ScoringReason[];
  recommendedAction: string;
  responseDraft: string;
  flaggedCritical: boolean;
}

export interface Complaint {
  id: string; // e.g. GMRC-2026-1001
  text: string;
  source: ComplaintSource;
  station: string;
  language: string;
  detectedLanguage: string;
  category: ComplaintCategory;
  department: Department;
  urgencyScore: number;
  priority: UrgencyLevel;
  reasons: ScoringReason[];
  recommendedAction: string;
  responseDraft: string;
  status: ComplaintStatus;
  internalNotes?: string;
  passengerContact?: string;
  createdAt: string;
  updatedAt: string;
  isSynthetic: boolean;
  pendingSync: boolean;
  syncedAt?: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  department: string;
  urgency: string;
  status: string;
  language: string;
  source: string;
  sortBy: 'newest' | 'oldest' | 'urgency_desc' | 'urgency_asc';
}

export interface MetricsSummary {
  total: number;
  critical: number;
  open: number;
  inProgress: number;
  resolved: number;
  pendingSync: number;
}
