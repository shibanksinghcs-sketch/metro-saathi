import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Copy,
  Check,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  ShieldAlert,
  Languages,
} from 'lucide-react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  Department,
} from '../types/complaint';
import { CATEGORY_TO_DEPARTMENT } from '../utils/nlpClassifier';
import { generateResponseDraft } from '../utils/responseTemplates';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onSave: (updated: Complaint) => void;
  onDelete: (id: string) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!complaint) return null;

  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [category, setCategory] = useState<ComplaintCategory>(complaint.category);
  const [department, setDepartment] = useState<Department>(complaint.department);
  const [urgencyScore, setUrgencyScore] = useState<number>(complaint.urgencyScore);
  const [responseDraft, setResponseDraft] = useState<string>(complaint.responseDraft);
  const [internalNotes, setInternalNotes] = useState<string>(complaint.internalNotes || '');
  const [activeLangTab, setActiveLangTab] = useState<'Gujarati' | 'Hindi' | 'English'>('English');

  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleCategoryChange = (newCat: ComplaintCategory) => {
    setCategory(newCat);
    const newDept = CATEGORY_TO_DEPARTMENT[newCat] || 'General Support';
    setDepartment(newDept);
    setResponseDraft(generateResponseDraft(newCat, activeLangTab, complaint.id, complaint.station));
  };

  const handleLangTabChange = (lang: 'Gujarati' | 'Hindi' | 'English') => {
    setActiveLangTab(lang);
    setResponseDraft(generateResponseDraft(category, lang, complaint.id, complaint.station));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAll = () => {
    let priority = complaint.priority;
    if (urgencyScore >= 80) priority = 'Critical';
    else if (urgencyScore >= 60) priority = 'High';
    else if (urgencyScore >= 30) priority = 'Medium';
    else priority = 'Low';

    const updated: Complaint = {
      ...complaint,
      category,
      department,
      status,
      urgencyScore,
      priority,
      responseDraft,
      internalNotes,
    };

    onSave(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#172033] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] dark:border-[#334155] bg-gradient-to-r from-teal-900 to-[#0F766E] text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm sm:text-base font-black tracking-wider text-teal-200">
                {complaint.id}
              </span>
              <span
                className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  urgencyScore >= 80
                    ? 'bg-red-500 text-white'
                    : urgencyScore >= 60
                    ? 'bg-amber-400 text-black'
                    : 'bg-teal-300 text-teal-950'
                }`}
              >
                Score: {urgencyScore}/100 • {complaint.priority}
              </span>
              {complaint.isSynthetic && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 text-white font-medium">
                  Synthetic Demo
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-xs text-teal-100">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{complaint.station}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(complaint.createdAt).toLocaleString()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Complaint Text */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] space-y-1.5">
            <div className="flex items-center justify-between text-[#64748B] dark:text-[#CBD5E1]">
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Passenger Grievance Narrative
              </span>
              <span className="font-semibold text-teal-700 dark:text-teal-300 text-[11px]">
                Language: {complaint.detectedLanguage} | Channel: {complaint.source}
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#1E293B] dark:text-[#F1F5F9] leading-relaxed">
              {complaint.text}
            </p>
            {complaint.passengerContact && (
              <div className="text-[11px] text-slate-500 pt-1 flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Contact reference: {complaint.passengerContact}</span>
              </div>
            )}
          </div>

          {/* Classification & Status Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Category (Override)
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                className="w-full p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] font-semibold text-xs"
              >
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
              <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Assigned Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] font-semibold text-xs"
              >
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

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Dispatch Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                className={`w-full p-2 rounded-xl border font-bold text-xs ${
                  status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                    : status === 'In Progress'
                    ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Explainable Scoring Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1E293B] dark:text-[#F1F5F9] text-xs flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Explainable Urgency Breakdown</span>
              </span>
              <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                Total Score: {urgencyScore}/100
              </span>
            </div>

            <div className="space-y-1.5">
              {complaint.reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#334155] text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {r.rule}
                    </span>
                    <span className="text-slate-500 text-[10px] block">{r.description}</span>
                  </div>
                  <span className="font-bold text-[#0F766E] dark:text-[#2DD4BF] ml-2 shrink-0">
                    +{r.points}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[11px] text-teal-900 dark:text-teal-200">
              <strong>Recommended Operational Protocol:</strong> {complaint.recommendedAction}
            </div>
          </div>

          {/* Editable Multilingual Response Draft */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#1E293B] dark:text-[#F1F5F9] flex items-center space-x-1.5">
                <Languages className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                <span>Passenger Response Draft</span>
              </label>

              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Draft selector */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['Gujarati', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLangTabChange(lang)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeLangTab === lang
                      ? 'bg-white dark:bg-[#172033] text-[#0F766E] dark:text-[#2DD4BF] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'Gujarati' ? 'ગુજરાતી' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>

            <textarea
              value={responseDraft}
              onChange={(e) => setResponseDraft(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          {/* Internal Staff Notes */}
          <div className="space-y-1">
            <label className="font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Internal Station Investigation Notes
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add supervisor notes, on-site inspection findings, CCTV reference..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            />
          </div>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 font-bold flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grievance updates saved to local SQLite database!</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm(`Delete grievance record ${complaint.id}?`)) {
                onDelete(complaint.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Dispatch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
