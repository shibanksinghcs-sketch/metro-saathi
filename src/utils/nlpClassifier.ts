import {
  ClassificationResult,
  ComplaintCategory,
  Department,
  ScoringReason,
  UrgencyLevel,
} from '../types/complaint';
import { generateResponseDraft } from './responseTemplates';

export interface KeywordRule {
  terms: string[];
  weight: number;
}

// Category keyword banks across Gujarati, Hindi, English, and Gujlish
const CATEGORY_KEYWORDS: Record<ComplaintCategory, string[]> = {
  'Safety & Security': [
    // English
    'fire', 'smoke', 'spark', 'bomb', 'theft', 'stolen', 'pickpocket', 'robbery',
    'harassment', 'molest', 'fight', 'violence', 'weapon', 'knife', 'blood',
    'accident', 'injured', 'fall', 'bleeding', 'emergency', 'panic', 'stampede',
    'security guard', 'police', 'cctv', 'unattended bag', 'suspicious', 'threat',
    // Gujarati
    'આગ', 'ધુમાડો', 'ચોરી', 'ખિસ્સાકાતરુ', 'છેડતી', 'ઝઘડો', 'મારામારી', 'હિંસા',
    'હથિયાર', 'લોહી', 'અકસ્માત', 'ઈજા', 'કટોકટી', 'પોલીસ', 'સુરક્ષા', 'શંકાસ્પદ',
    'સુરક્ષા ગાર્ડ', 'ધક્કામુક્કી', 'ચોરાઈ', 'લૂંટ',
    // Hindi
    'आग', 'धुआं', 'चोरी', 'जेबकतरा', 'छेड़खानी', 'झगड़ा', 'मारपीट', 'हिंसा',
    'हथियार', 'खून', 'दुर्घटना', 'चोट', 'आपातकाल', 'पुलिस', 'सुरक्षा', 'संदिग्ध',
    'धक्का-मुक्की', 'लूट', 'सुरक्षाकर्मी',
    // Gujlish
    'aag', 'dhumado', 'chori', 'chhedti', 'jhagdo', 'maramari', 'hinsa',
    'lohi', 'accident', 'ija', 'chot', 'police', 'suraksha', 'chori thai',
    'bag chori', 'pickpocket thayo', 'harass', 'dhamki', 'maar peet',
  ],
  'Cleanliness': [
    // English
    'dirty', 'garbage', 'trash', 'waste', 'vomit', 'spit', 'gutkha', 'pan masala',
    'dustbin', 'toilet', 'washroom', 'urinal', 'smell', 'foul', 'stink', 'cleanliness',
    'water leak', 'puddle', 'spilled', 'stain', 'mosquito', 'cockroach', 'insects',
    // Gujarati
    'ગંદકી', 'કચરો', 'ઉલટી', 'થૂંક', 'ગુટખા', 'કચરાપેટી', 'શૌચાલય', 'વોશરૂમ',
    'દુર્ગંધ', 'વાસ', 'સફાઈ', 'પાણી ભરાયું', 'ડાઘ', 'મચ્છર', 'ગંદુ', 'સંડાસ',
    // Hindi
    'गंदगी', 'कचरा', 'उल्टी', 'थूक', 'गुटखा', 'कूड़ेदान', 'शौचालय', 'वॉशरूम',
    'बदबू', 'सफाई', 'पानी भरा', 'दाग', 'मच्छर', 'गंदा',
    // Gujlish
    'gandki', 'kachro', 'kachra', 'ulti', 'thuk', 'gutkha', 'kachrapeti',
    'washroom', 'toilet', 'durgandh', 'durgand', 'vaas', 'safai', 'safai nathi',
    'badbu', 'gandu che', 'paani bharayelu', 'smell ave che', 'dustbin full',
  ],
  'Fare & Payments': [
    // English
    'fare', 'ticket', 'token', 'smartcard', 'card recharge', 'payment', 'upi',
    'refund', 'deducted', 'overcharge', 'tvm', 'vending machine', 'counter',
    'gate rejected', 'fare dispute', 'money cut', 'balance', 'qr code', 'scanner',
    // Gujarati
    'ભાડું', 'ટિકિટ', 'ટોકન', 'સ્માર્ટકાર્ડ', 'રિચાર્જ', 'ચુકવણી', 'રિફંડ',
    'પૈસા કપાયા', 'વધારાનું ભાડું', 'મશીન', 'કાઉન્ટર', 'ગેટ', 'ક્યૂઆર કોડ',
    'બેલેન્સ', 'નાણાં',
    // Hindi
    'किराया', 'टिकट', 'टोकन', 'स्मार्टकार्ड', 'रिचार्ज', 'भुगतान', 'रिफंड',
    'पैसे कटे', 'अधिक किराया', 'मशीन', 'काउंटर', 'गेट', 'क्यूआर कोड', 'बैलेंस',
    // Gujlish
    'bhadu', 'ticket', 'token', 'smartcard', 'recharge', 'payment', 'refund',
    'paise cut gaya', 'paisa kapaya', 'paise kat gaye', 'machine bandh',
    'gate na khulyo', 'qr scan nathi thatu', 'balance nathi aavyu', 'extra charge',
  ],
  'Lift & Accessibility': [
    // English
    'lift', 'elevator', 'stuck inside', 'trapped', 'wheelchair', 'ramp',
    'disabled', 'handicapped', 'elderly', 'senior citizen', 'tactile',
    'braille', 'blind', 'accessibility', 'divyang', 'lift button', 'lift alarm',
    // Gujarati
    'લિફ્ટ', 'એલિવેટર', 'ફસાયા', 'વ્હીલચેર', 'રેમ્પ', 'દિવ્યાંગ', 'વૃદ્ધ',
    'અંધ', 'એક્સેસિબિલિટી', 'લિફ્ટ બંધ', 'લિફ્ટ બટન', 'અંદર ફસાયેલા',
    // Hindi
    'लिफ्ट', 'एलिवेटर', 'फंसे', 'व्हीलचेयर', 'रैंप', 'दिव्यांग', 'बुजुर्ग',
    'अंधे', 'एक्सेसिबिलिटी', 'लिफ्ट बंद', 'लिफ्ट में फंसे',
    // Gujlish
    'lift', 'lift bandh che', 'lift ma fasaya', 'fasai gaya', 'wheelchair nathi',
    'ramp nathi', 'divyang', 'vruddh', 'bujurg', 'lift not working',
    'lift ma atki gaya', 'lift button kaam nathi karto',
  ],
  'Escalator': [
    // English
    'escalator', 'moving stairs', 'moving walkway', 'escalator stopped',
    'escalator jerking', 'stairs not working', 'staircase', 'handrail',
    // Gujarati
    'એસ્કેલેટર', 'સરકતી સીડી', 'સીડી બંધ', 'એસ્કેલેટર બંધ', 'પગથિયાં',
    // Hindi
    'एस्केलेटर', 'स्वचालित सीढ़ी', 'सीढ़ी बंद', 'एस्केलेटर बंद',
    // Gujlish
    'escalator', 'escalator bandh che', 'escalator nathi chaltu',
    'sidi bandh', 'sirki sidi', 'escalator awaj kare che',
  ],
  'Staff Behaviour': [
    // English
    'staff', 'officer', 'guard', 'cashier', 'operator', 'rude', 'misbehave',
    'shouting', 'abusive', 'slang', 'bribe', 'refused help', 'unprofessional',
    'attitude', 'insult', 'behavior', 'misbehaviour',
    // Gujarati
    'સ્ટાફ', 'કર્મચારી', 'અધિકારી', 'ગાર્ડ', 'તોછડું', 'ગેરવર્તણૂક', 'બૂમો',
    'ગાળો', 'લાંચ', 'મદદ ના કરી', 'અપમાન', 'વર્તન', 'દાદાગીરી',
    // Hindi
    'कर्मचारी', 'स्टाफ', 'अधिकारी', 'गार्ड', 'बदतमीजी', 'दुर्व्यवहार',
    'गाली', 'रिश्वत', 'मदद नहीं की', 'अपमान', 'अभद्र व्यवहार',
    // Gujlish
    'staff', 'karmachari', 'guard', 'officer', 'rude che', 'misbehave karyo',
    'tochdo jawab', 'dadagiri', 'gaali aapi', 'bhadkya', 'madad na kari',
    'bolva nathi mangto', 'attitude batave che', 'badtameezi',
  ],
  'Service & Information': [
    // English
    'delay', 'late', 'train frequency', 'announcement', 'display', 'screen',
    'schedule', 'metro timing', 'route map', 'helpdesk', 'inquiry',
    'ac not cooling', 'air conditioning', 'speaker', 'signage', 'board',
    // Gujarati
    'વિલંબ', 'મોડું', 'સમયપત્રક', 'જાહેરાત', 'ડિસ્પ્લે', 'સ્ક્રીન',
    'એસી', 'ઠંડક', 'સ્પીકર', 'માહિતી', 'ટ્રેન લેટ', 'પાટીયું',
    // Hindi
    'देरी', 'लेट', 'समय सारणी', 'घोषणा', 'डिस्प्ले', 'स्क्रीन',
    'एसी', 'स्पीकर', 'जानकारी', 'सूचना', 'साइन बोर्ड',
    // Gujlish
    'late', 'delay che', 'train frequency', 'announcement nathi', 'display bandh',
    'ac kaam nathi karto', 'garmi thaye che', 'train timing', 'schedule nathi batavto',
    'speaker aawaj nathi', 'mahiti nathi malte',
  ],
  'Other / Needs Review': [],
};

// Department routing map
export const CATEGORY_TO_DEPARTMENT: Record<ComplaintCategory, Department> = {
  'Safety & Security': 'Safety and Security',
  'Cleanliness': 'Housekeeping',
  'Fare & Payments': 'Ticketing and Revenue',
  'Lift & Accessibility': 'Station Maintenance and Accessibility',
  'Escalator': 'Station Maintenance',
  'Staff Behaviour': 'Customer Relations',
  'Service & Information': 'Passenger Support',
  'Other / Needs Review': 'General Support',
};

// Critical & high severity trigger words
interface SeverityTrigger {
  terms: string[];
  points: number;
  rule: string;
  description: string;
}

const SEVERITY_TRIGGERS: SeverityTrigger[] = [
  {
    terms: ['fire', 'smoke', 'spark', 'blast', 'bomb', 'આગ', 'ધુમાડો', 'વિસ્ફોટ', 'आग', 'धुआं', 'ब्लास्ट', 'aag', 'dhumado'],
    points: 50,
    rule: 'Fire/Smoke Emergency',
    description: 'Active hazard of fire, smoke, spark, or explosion hazard detected.',
  },
  {
    terms: ['trapped', 'stuck inside', 'suffocating', 'ફસાયા', 'અંદર ફસાયેલા', 'फंसे हुए', 'लिफ्ट में फंसे', 'fasaya', 'fasai gaya', 'atki gaya'],
    points: 45,
    rule: 'Entrapment Danger',
    description: 'Passenger reportedly trapped inside lift, enclosed car, or blocked doorway.',
  },
  {
    terms: ['harassment', 'molest', 'stalking', 'छेड़खानी', 'છેડતી', 'chhedti', 'harass', 'gandi harkat'],
    points: 40,
    rule: 'Passenger Harassment/Molestation',
    description: 'Report of sexual harassment, molestation, or imminent passenger vulnerability.',
  },
  {
    terms: ['fight', 'violence', 'blood', 'weapon', 'knife', 'મારામારી', 'હિંસા', 'લોહી', 'હથિયાર', 'मारपीट', 'हिंसा', 'खून', 'हथियार', 'maramari', 'chaku'],
    points: 38,
    rule: 'Violence or Weapon Detected',
    description: 'Physical altercation, blood, weapon report, or assault.',
  },
  {
    terms: ['theft', 'stolen', 'robbery', 'pickpocket', 'ચોરી', 'લૂંટ', 'ખિસ્સાકાતરુ', 'चोरी', 'जेबकतरा', 'chori', 'loot'],
    points: 25,
    rule: 'Criminal Theft / Pickpocketing',
    description: 'Report of personal property theft or active pickpocket in metro premises.',
  },
  {
    terms: ['injured', 'bleeding', 'fracture', 'fall down', 'ઈજા', 'પડી ગયા', 'चोट लगी', 'गिर गए', 'ija', 'padi gaya'],
    points: 35,
    rule: 'Passenger Injury Hazard',
    description: 'Passenger sustained physical injury or acute slip/fall accident.',
  },
  {
    terms: ['wheelchair', 'ramp', 'blind', 'elderly', 'divyang', 'દિવ્યાંગ', 'વૃદ્ધ', 'અંધ', 'दिव्यांग', 'बुजुर्ग', 'vruddh', 'bujurg'],
    points: 20,
    rule: 'Accessibility Priority for Divyang/Elderly',
    description: 'Involves wheelchair accessibility, visually impaired, or elderly passenger mobility.',
  },
  {
    terms: ['repeated', 'second time', 'no action taken', 'third time', 'વારંવાર', 'બીજી વાર', 'કોઈ પગલાં નહીં', 'बार-बार', 'दूसरी बार', 'karoi pagla nathi', 'fari thi'],
    points: 15,
    rule: 'Repeated Unresolved Complaint',
    description: 'Indication that this grievance was previously reported without resolution.',
  },
  {
    terms: ['stampede', 'crowd rush', 'panic', 'suffocating', 'ધક્કામુક્કી', 'ભાગદોડ', 'धक्का-मुक्की', 'भगदड़', 'bheed', 'dhakkamukki'],
    points: 30,
    rule: 'Crowd Hazard / Panic Disruption',
    description: 'Station crowding, bottleneck, or potential stampede concern at platform/concourse.',
  },
  {
    terms: ['money cut', 'balance deducted', 'refund pending', 'पैसे कटे', 'પૈસા કપાયા', 'paise cut'],
    points: 12,
    rule: 'Passenger Financial Loss',
    description: 'Monetary deduction or ticket balance dispute awaiting verification.',
  },
];

// Helper: Detect language based on Unicode characters & Gujlish markers
export function detectLanguage(text: string): 'Gujarati' | 'Hindi' | 'English' | 'Gujlish' | 'Other' {
  if (!text || text.trim().length === 0) return 'English';

  const gujaratiRegex = /[\u0A80-\u0AFF]/g;
  const devanagariRegex = /[\u0900-\u097F]/g;

  const gujaratiMatches = text.match(gujaratiRegex);
  const devanagariMatches = text.match(devanagariRegex);

  const gujCount = gujaratiMatches ? gujaratiMatches.length : 0;
  const devCount = devanagariMatches ? devanagariMatches.length : 0;

  if (gujCount > 3) return 'Gujarati';
  if (devCount > 3) return 'Hindi';

  // Check for Gujlish markers (Gujarati words written in Latin script)
  const gujlishMarkers = [
    'che', 'chhe', 'nathi', 'thayo', 'thai', 'thaye', 'paisa', 'paise', 'bhadu',
    'kachro', 'gandki', 'bandh', 'atki', 'joye', 'aavtu', 'aavi', 'tamari',
    'mari', 'mara', 'karyo', 'kare', 'ma', 'par', 'thi', 'ane', 'su', 'shu',
    'karo', 'nathi', 'kevi', 'rite', 'gyo', 'gaya', 'fasaya', 'bheed', 'dadagiri',
  ];

  const lower = text.toLowerCase();
  const words = lower.split(/[\s,.;:!?\-+*/()]+/);
  let gujlishWordCount = 0;
  for (const word of words) {
    if (gujlishMarkers.includes(word)) {
      gujlishWordCount++;
    }
  }

  if (gujlishWordCount >= 2 || (words.length <= 6 && gujlishWordCount >= 1)) {
    return 'Gujlish';
  }

  // Check if mostly Latin characters
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  if (latinCount > 3) return 'English';

  return 'Other';
}

// Recommend immediate operational action based on category & score
function getRecommendedAction(category: ComplaintCategory, score: number, station: string): string {
  const stn = station ? `at ${station}` : 'at station';
  if (score >= 80) {
    if (category === 'Lift & Accessibility') {
      return `EMERGENCY DISPATCH: Alert Station Controller and dispatch Lift Maintenance tech to rescue passengers immediately ${stn}.`;
    }
    if (category === 'Safety & Security') {
      return `URGENT ACTION: Alert Metro Police Unit and Station Security supervisor for on-site tactical response ${stn}.`;
    }
    return `CRITICAL REVIEW: Escalate to Duty Station Manager for priority review within 15 minutes ${stn}.`;
  }

  if (score >= 60) {
    if (category === 'Escalator') {
      return `HIGH PRIORITY: Cordon off escalator and notify engineering crew for mechanical repair ${stn}.`;
    }
    if (category === 'Cleanliness') {
      return `HIGH PRIORITY: Dispatch roving housekeeping team for urgent hazard cleaning and sanitization ${stn}.`;
    }
    return `HIGH PRIORITY: Route to Department shift supervisor for investigation within 60 minutes ${stn}.`;
  }

  if (score >= 30) {
    if (category === 'Fare & Payments') {
      return `STANDARD ACTION: Queue for AFC (Automated Fare Collection) transaction audit and log verification.`;
    }
    if (category === 'Staff Behaviour') {
      return `STANDARD ACTION: Assign to Customer Relations for passenger call-back and staff log review.`;
    }
    return `STANDARD ACTION: Route to relevant department desk for queue resolution within standard 4-hour SLA.`;
  }

  return `ROUTINE ACTION: Log in standard resolution queue. Review during scheduled shift inspection.`;
}

// Main classification & urgency scoring engine
export function classifyComplaint(
  text: string,
  station: string = 'Gujarat Metro',
  manualLanguage?: string,
  manualCategory?: ComplaintCategory
): ClassificationResult {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Detect language
  const detectedLang = detectLanguage(cleanText);
  const effectiveLang = (manualLanguage && manualLanguage !== 'Auto-detect')
    ? (manualLanguage as 'Gujarati' | 'Hindi' | 'English' | 'Gujlish' | 'Other')
    : detectedLang;

  // If category is manually specified by operator, respect it
  let bestCategory: ComplaintCategory = manualCategory || 'Other / Needs Review';
  let bestScore = 0;
  const categoryScores: Record<ComplaintCategory, number> = {
    'Safety & Security': 0,
    'Cleanliness': 0,
    'Fare & Payments': 0,
    'Lift & Accessibility': 0,
    'Escalator': 0,
    'Staff Behaviour': 0,
    'Service & Information': 0,
    'Other / Needs Review': 0,
  };

  // Match category keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ComplaintCategory, string[]][]) {
    let matches = 0;
    for (const kw of keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        // Boost longer keyword matches
        matches += kw.length > 5 ? 2 : 1;
      }
    }
    categoryScores[category] = matches;
    if (!manualCategory && matches > bestScore) {
      bestScore = matches;
      bestCategory = category;
    }
  }

  // If no strong match or empty text
  if (!manualCategory && bestScore === 0) {
    bestCategory = 'Other / Needs Review';
  }

  const assignedDepartment = CATEGORY_TO_DEPARTMENT[bestCategory] || 'General Support';

  // Urgency scoring calculation (0-100)
  let urgency = 15; // Base routine baseline
  const reasons: ScoringReason[] = [
    {
      rule: 'Baseline Grievance Intake',
      points: 15,
      description: 'Standard baseline score for registered passenger grievance.',
    },
  ];

  // Category specific base points
  const categoryBaseWeights: Record<ComplaintCategory, number> = {
    'Safety & Security': 30,
    'Lift & Accessibility': 25,
    'Escalator': 15,
    'Cleanliness': 10,
    'Fare & Payments': 10,
    'Staff Behaviour': 12,
    'Service & Information': 8,
    'Other / Needs Review': 5,
  };

  const catWeight = categoryBaseWeights[bestCategory] || 5;
  urgency += catWeight;
  reasons.push({
    rule: `Category Baseline (${bestCategory})`,
    points: catWeight,
    description: `Category weighting assigned to ${bestCategory} department queue.`,
  });

  // Evaluate severity triggers
  let triggerSum = 0;
  for (const trigger of SEVERITY_TRIGGERS) {
    const matchedTerms: string[] = [];
    for (const term of trigger.terms) {
      if (lowerText.includes(term.toLowerCase())) {
        matchedTerms.push(term);
      }
    }

    if (matchedTerms.length > 0) {
      triggerSum += trigger.points;
      urgency += trigger.points;
      reasons.push({
        rule: trigger.rule,
        points: trigger.points,
        description: trigger.description,
        matchedTerms,
      });
    }
  }

  // Text length / descriptive detail bonus (detailed reports get slight weight for completeness)
  if (cleanText.length > 120) {
    urgency += 5;
    reasons.push({
      rule: 'Detailed Grievance Report',
      points: 5,
      description: 'Extended complaint narrative with station details and situational context.',
    });
  }

  // Cap score between 5 and 100
  urgency = Math.min(100, Math.max(5, urgency));

  // Determine Priority Band
  let priority: UrgencyLevel = 'Low';
  if (urgency >= 80) {
    priority = 'Critical';
  } else if (urgency >= 60) {
    priority = 'High';
  } else if (urgency >= 30) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  // Calculate confidence score (0.0 to 1.0)
  let confidence = 0.5;
  if (bestScore >= 3) confidence = 0.95;
  else if (bestScore === 2) confidence = 0.85;
  else if (bestScore === 1) confidence = 0.70;
  else confidence = 0.45;

  const flaggedCritical = priority === 'Critical';
  const recommendedAction = getRecommendedAction(bestCategory, urgency, station);
  const responseDraft = generateResponseDraft(bestCategory, effectiveLang, 'GMRC-NEW', station);

  return {
    category: bestCategory,
    department: assignedDepartment,
    urgencyScore: urgency,
    priority,
    detectedLanguage: effectiveLang,
    confidence,
    reasons,
    recommendedAction,
    responseDraft,
    flaggedCritical,
  };
}
