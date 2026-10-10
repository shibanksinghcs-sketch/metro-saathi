import React, { useState, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Info,
  Layers,
  ArrowRight,
  Edit3,
  Copy,
  Check,
} from 'lucide-react';
import {
  ComplaintCategory,
  Department,
  ComplaintSource,
  ComplaintLanguage,
  ClassificationResult,
  Complaint,
} from '../types/complaint';
import { GUJARAT_METRO_STATIONS } from '../data/stations';
import {
  classifyComplaint,
  CATEGORY_TO_DEPARTMENT,
} from '../utils/nlpClassifier';
import { addComplaint, importComplaintsFromCSV } from '../utils/storage';
import { generateResponseDraft } from '../utils/responseTemplates';

interface NewComplaintViewProps {
  onComplaintCreated: (complaint: Complaint) => void;
  onNavigateToAll: () => void;
}

export const NewComplaintView: React.FC<NewComplaintViewProps> = ({
  onComplaintCreated,
  onNavigateToAll,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Form Fields
  const [complaintText, setComplaintText] = useState<string>('');
  const [station, setStation] = useState<string>('Thaltej');
  const [source, setSource] = useState<ComplaintSource>('App');
  const [language, setLanguage] = useState<ComplaintLanguage>('Auto-detect');
  const [passengerContact, setPassengerContact] = useState<string>('');

  // Live Analysis & Result state
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [editableCategory, setEditableCategory] = useState<ComplaintCategory>('Other / Needs Review');
  const [editableDepartment, setEditableDepartment] = useState<Department>('General Support');
  const [editableResponseDraft, setEditableResponseDraft] = useState<string>('');
  const [draftLanguageTab, setDraftLanguageTab] = useState<'Gujarati' | 'Hindi' | 'English'>('English');

  // UI state
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successSaved, setSuccessSaved] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Bulk CSV state
  const [csvContent, setCsvContent] = useState<string>('');
  const [bulkResult, setBulkResult] = useState<any>(null);

  // Quick preset test cases for judges
  const PRESET_CASES = [
    {
      label: '🚨 Gujarati: લિફ્ટમાં વૃદ્ધ ફસાયા',
      desc: 'Critical lift entrapment in Gujarati',
      text: 'પ્લેટફોર્મ 1 પર લિફ્ટ અચાનક બંધ થઈ ગઈ છે અને અંદર 2 વૃદ્ધ મુસાફરો ફસાયા છે. એલાર્મ વાગી રહ્યો છે પણ કોઈ સ્ટાફ નથી. તાત્કાલિક મદદ મોકલો!',
      station: 'Thaltej',
      lang: 'Gujarati',
      source: 'App',
    },
    {
      label: '⚠️ Hindi: एस्केलेटर पर काला धुआं',
      desc: 'Smoke hazard in Hindi',
      text: 'मोटेरा स्टेडियम मेट्रो स्टेशन के कॉनकोर्स एरिया में एस्केलेटर के पास से काला धुआं और जलने की बदबू आ रही है। लोग घबरा रहे हैं, तुरंत जांच करें!',
      station: 'Motera Stadium',
      lang: 'Hindi',
      source: 'Social Media',
    },
    {
      label: '💳 Gujlish: UPI પૈસા કપાયા ટિકિટ ના આવી',
      desc: 'Fare dispute in Gujlish',
      text: 'TVM machine ma UPI thi Rs. 50 pay karya, mara account mathi paise cut gaya pan ticket nathi aavi. Gate par token pan na malyu. Refund api dyo.',
      station: 'Paldi',
      lang: 'Gujlish',
      source: 'App',
    },
    {
      label: '🧹 English: Spilled tea & broken glass',
      desc: 'Slip & injury risk in English',
      text: 'Large puddle of spilled sweet tea and broken glass bottle near escalator landing on Concourse level. Commuters are slipping, immediate cleaning required.',
      station: 'Vastral Gam',
      lang: 'English',
      source: 'Helpdesk',
    },
    {
      label: '👮 Gujarati: કાઉન્ટર સ્ટાફની ગેરવર્તણૂક',
      desc: 'Staff misbehaviour in Gujarati',
      text: 'ટિકિટ કાઉન્ટર પર બેઠેલા કર્મચારી ખૂબ તોછડાઈથી વાત કરે છે. પૈસા પાછા માંગ્યા તો ગાળો આપી અને દાદાગીરી કરી. યોગ્ય પગલાં ભરો.',
      station: 'Commerce Six Road',
      lang: 'Gujarati',
      source: 'Paper',
    },
  ];

  // Run live grievance analysis whenever text, station, or language selection changes
  useEffect(() => {
    if (complaintText.trim().length > 3) {
      const result = classifyComplaint(
        complaintText,
        station,
        language === 'Auto-detect' ? undefined : language
      );
      setClassification(result);
      setEditableCategory(result.category);
      setEditableDepartment(result.department);

      // Set initial draft language based on detected language
      let initLang: 'Gujarati' | 'Hindi' | 'English' = 'English';
      if (result.detectedLanguage === 'Gujarati' || result.detectedLanguage === 'Gujlish') {
        initLang = 'Gujarati';
      } else if (result.detectedLanguage === 'Hindi') {
        initLang = 'Hindi';
      }
      setDraftLanguageTab(initLang);
      setEditableResponseDraft(
        generateResponseDraft(result.category, initLang, 'GMRC-NEW', station)
      );
    } else {
      setClassification(null);
    }
  }, [complaintText, station, language]);

  // Handle switching draft language tab
  const handleDraftLangChange = (lang: 'Gujarati' | 'Hindi' | 'English') => {
    setDraftLanguageTab(lang);
    setEditableResponseDraft(
      generateResponseDraft(editableCategory, lang, 'GMRC-NEW', station)
    );
  };

  // Handle category override
  const handleCategoryChange = (newCat: ComplaintCategory) => {
    setEditableCategory(newCat);
    const newDept = CATEGORY_TO_DEPARTMENT[newCat] || 'General Support';
    setEditableDepartment(newDept);
    setEditableResponseDraft(
      generateResponseDraft(newCat, draftLanguageTab, 'GMRC-NEW', station)
    );
  };

  // Handle submit and save to local offline storage
  const handleSaveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!complaintText.trim()) {
      setErrorMessage('Please enter the complaint text.');
      return;
    }

    if (!classification) {
      setErrorMessage('Could not analyze complaint. Please ensure text is provided.');
      return;
    }

    const saved = addComplaint({
      text: complaintText.trim(),
      source,
      station,
      language,
      detectedLanguage: classification.detectedLanguage,
      category: editableCategory,
      department: editableDepartment,
      urgencyScore: classification.urgencyScore,
      priority: classification.priority,
      reasons: classification.reasons,
      recommendedAction: classification.recommendedAction,
      responseDraft: editableResponseDraft,
      status: 'Open',
      passengerContact: passengerContact.trim() || undefined,
      internalNotes: 'Initial intake via Station Grievance Terminal.',
    });

    setSuccessSaved(true);
    onComplaintCreated(saved);

    setTimeout(() => {
      setSuccessSaved(false);
      setComplaintText('');
      setPassengerContact('');
      setClassification(null);
    }, 1800);
  };

  const handleClear = () => {
    setComplaintText('');
    setPassengerContact('');
    setClassification(null);
    setErrorMessage('');
  };

  const handleApplyPreset = (preset: typeof PRESET_CASES[0]) => {
    setComplaintText(preset.text);
    setStation(preset.station);
    setLanguage(preset.lang as any);
    setSource(preset.source as any);
    setErrorMessage('');
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableResponseDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Bulk CSV import handler
  const handleBulkImport = () => {
    if (!csvContent.trim()) {
      setBulkResult({ errors: ['CSV content is empty.'] });
      return;
    }
    const result = importComplaintsFromCSV(csvContent);
    setBulkResult(result);
    if (result.successCount > 0) {
      setCsvContent('');
    }
  };

  const sampleCSVTemplate = `complaint_text,station,source,language,contact
"Lift stuck on platform 2 with wheelchair passenger","Thaltej","App","English","+91 9825000001"
"સ્ટેશન પર કચરો અને દુર્ગંધ છે","APMC","Paper","Gujarati","Anonymous"
"स्मार्टकार्ड से किराया कट गया लेकिन गेट नहीं खुला","Paldi","Helpdesk","Hindi","Card #4421"
"AC coach ma garmi bahu lage che, display bandh","Motera Stadium","Social Media","Gujlish","@commuter"`;

  return (
    <div className="space-y-6">
      {/* View Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
            Intelligent Grievance Intake
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
            Deterministic multilingual triage, explainable scoring & localized response drafting.
          </p>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-slate-200/80 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#334155]">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'single'
                ? 'bg-white dark:bg-[#172033] text-[#0F766E] dark:text-[#2DD4BF] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Single Intake
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bulk'
                ? 'bg-white dark:bg-[#172033] text-[#0F766E] dark:text-[#2DD4BF] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bulk CSV Upload</span>
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Judge Demo Quick Presets */}
            <div className="bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2-Minute Demo Test Presets:</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click to prefill & test
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_CASES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#172033] border border-teal-300 dark:border-teal-800 text-[#1E293B] dark:text-[#F1F5F9] font-medium hover:bg-teal-100/60 dark:hover:bg-teal-900/40 transition-colors shadow-2xs text-left"
                    title={preset.desc}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intake Form */}
            <form onSubmit={handleSaveComplaint} className="bg-white dark:bg-[#172033] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
              {/* Text Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] uppercase tracking-wider">
                    Complaint Text <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Supports Gujarati, Hindi, English & Gujlish
                  </span>
                </div>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Enter passenger complaint narrative in Gujarati (ગુજરાતી), Hindi (हिंदी), English, or Gujlish..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E] dark:focus:ring-[#2DD4BF] transition-all resize-y"
                  required
                />
              </div>

              {/* Station & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                    Metro Station / Location
                  </label>
                  <select
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  >
                    {GUJARAT_METRO_STATIONS.map((stn) => (
                      <option key={stn} value={stn}>
                        {stn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                    Grievance Channel / Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as ComplaintSource)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  >
                    <option value="App">Mobile App (Official)</option>
                    <option value="Social Media">Social Media (Twitter/X / WhatsApp)</option>
                    <option value="Email">Email / Web Portal</option>
                    <option value="Paper">Paper Grievance Form</option>
                    <option value="Helpdesk">Station Helpdesk Kiosk</option>
                    <option value="Other">Other / Intercom</option>
                  </select>
                </div>
              </div>

              {/* Language Selection & Passenger Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                    Language Override
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as ComplaintLanguage)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  >
                    <option value="Auto-detect">Auto-detect (Recommended)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="English">English</option>
                    <option value="Gujlish">Gujlish (Mixed Latin)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                    Passenger Contact / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={passengerContact}
                    onChange={(e) => setPassengerContact(e.target.value)}
                    placeholder="+91 98250... or Token #..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Complaint registered & queued in local database!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={!complaintText.trim() || successSaved}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>Register & Dispatch Grievance</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Grievance Intelligence Analysis Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#172033] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                  <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                    Grievance Intelligence Analysis
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-[#2DD4BF]">
                  Offline Rule Engine
                </span>
              </div>

              {!classification ? (
                <div className="py-12 text-center text-[#64748B] dark:text-slate-400 space-y-2">
                  <Info className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500" />
                  <p className="text-xs">
                    Type a complaint narrative or select a preset to view automated categorization, urgency scoring, and response drafts.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Priority & Score Header */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                        Urgency Score
                      </span>
                      <span
                        className={`text-sm font-black px-2.5 py-0.5 rounded-full ${
                          classification.priority === 'Critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : classification.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {classification.urgencyScore} / 100 • {classification.priority}
                      </span>
                    </div>

                    {/* Visual Meter */}
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          classification.urgencyScore >= 80
                            ? 'bg-[#DC2626]'
                            : classification.urgencyScore >= 60
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#0F766E]'
                        }`}
                        style={{ width: `${classification.urgencyScore}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Low (0-29)</span>
                      <span>Medium (30-59)</span>
                      <span>High (60-79)</span>
                      <span>Critical (80-100)</span>
                    </div>
                  </div>

                  {/* Classification & Department (Editable by Operator) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748B] dark:text-[#CBD5E1]">
                        Category (Editable)
                      </label>
                      <select
                        value={editableCategory}
                        onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] font-semibold text-xs text-[#1E293B] dark:text-[#F1F5F9]"
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

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748B] dark:text-[#CBD5E1]">
                        Assigned Dept.
                      </label>
                      <input
                        type="text"
                        disabled
                        value={editableDepartment}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Detected Language */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B]">
                    <span className="text-[#64748B] dark:text-[#CBD5E1]">Language Detected:</span>
                    <span className="font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                      {classification.detectedLanguage} ({Math.round(classification.confidence * 100)}% conf.)
                    </span>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-teal-950 dark:text-teal-200">
                    <div className="font-bold mb-1 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Recommended Operational Protocol:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {classification.recommendedAction}
                    </p>
                  </div>

                  {/* Explainable Scoring Reasons */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                      Explainable Scoring Breakdown:
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {classification.reasons.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#1E293B]/60 text-[11px]"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {r.rule}
                            </div>
                            <div className="text-slate-500 text-[10px]">{r.description}</div>
                            {r.matchedTerms && (
                              <div className="text-teal-700 dark:text-teal-300 font-mono text-[9px] mt-0.5">
                                Matched: {r.matchedTerms.join(', ')}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-[#0F766E] dark:text-[#2DD4BF] ml-2 shrink-0">
                            +{r.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multilingual Response Draft */}
                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                        Passenger Response Draft (Editable)
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        className="text-xs text-[#0F766E] dark:text-[#2DD4BF] hover:underline flex items-center space-x-1"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Text</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Language draft tabs */}
                    <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      {(['Gujarati', 'Hindi', 'English'] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleDraftLangChange(lang)}
                          className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                            draftLanguageTab === lang
                              ? 'bg-white dark:bg-[#172033] text-[#0F766E] dark:text-[#2DD4BF] shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {lang === 'Gujarati' ? 'ગુજરાતી' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={editableResponseDraft}
                      onChange={(e) => setEditableResponseDraft(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-xs text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-1 focus:ring-[#0F766E] resize-none"
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 italic text-center">
                    Note: Automated prototype classification requires human operational verification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Bulk CSV Intake Tab */
        <div className="bg-white dark:bg-[#172033] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Bulk CSV Grievance Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
              Process hundreds of passenger complaints collected from paper suggestion boxes, legacy kiosks, or station spreadsheets without network connectivity.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] uppercase tracking-wider">
                Paste CSV Records or Template
              </label>
              <button
                type="button"
                onClick={() => setCsvContent(sampleCSVTemplate)}
                className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold hover:underline"
              >
                Load Sample CSV Format
              </button>
            </div>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="complaint_text,station,source,language,contact&#10;Your complaint text here,Thaltej,App,English,+91..."
              rows={8}
              className="w-full font-mono text-xs p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B1220] text-[#1E293B] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#64748B] dark:text-slate-400">
              Columns recognized: <code className="text-teal-700 dark:text-teal-300 font-bold">complaint_text</code>, <code className="text-teal-700 dark:text-teal-300 font-bold">station</code>, <code className="text-teal-700 dark:text-teal-300 font-bold">source</code>, <code className="text-teal-700 dark:text-teal-300 font-bold">language</code>, <code className="text-teal-700 dark:text-teal-300 font-bold">contact</code>
            </div>

            <button
              onClick={handleBulkImport}
              disabled={!csvContent.trim()}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Parse & Ingest CSV Records</span>
            </button>
          </div>

          {bulkResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
              <h4 className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Bulk Import Summary:</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-[#0B1220]">
                  <div className="text-slate-500 text-[10px]">Total Processed</div>
                  <div className="font-bold text-base">{bulkResult.totalProcessed || 0}</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#0B1220]">
                  <div className="text-emerald-600 text-[10px]">Successfully Ingested</div>
                  <div className="font-bold text-base text-emerald-600">{bulkResult.successCount || 0}</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#0B1220]">
                  <div className="text-red-600 text-[10px]">Critical Flagged</div>
                  <div className="font-bold text-base text-red-600">{bulkResult.criticalCount || 0}</div>
                </div>
              </div>

              {bulkResult.errors && bulkResult.errors.length > 0 && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400">
                  Warnings: {bulkResult.errors.join('; ')}
                </div>
              )}

              {bulkResult.successCount > 0 && (
                <div className="pt-2 text-right">
                  <button
                    onClick={onNavigateToAll}
                    className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] hover:underline"
                  >
                    View All Imported Records in Grievance Table →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
