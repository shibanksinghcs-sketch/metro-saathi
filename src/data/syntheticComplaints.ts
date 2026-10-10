import { Complaint } from '../types/complaint';
import { classifyComplaint } from '../utils/nlpClassifier';

export interface RawSyntheticComplaint {
  id: string;
  text: string;
  source: 'App' | 'Email' | 'Social Media' | 'Paper' | 'Helpdesk' | 'Other';
  station: string;
  language: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  passengerContact: string;
  createdAt: string;
}

const RAW_SYNTHETIC_DATA: RawSyntheticComplaint[] = [
  // 1. Critical Lift Entrapment (Gujarati)
  {
    id: 'GMRC-2026-1001',
    text: 'પ્લેટફોર્મ 1 પર લિફ્ટ અચાનક બંધ થઈ ગઈ છે અને અંદર 2 વૃદ્ધ મુસાફરો ફસાયા છે. એલાર્મ વાગી રહ્યો છે પણ કોઈ સ્ટાફ નથી. તાત્કાલિક મદદ મોકલો!',
    source: 'App',
    station: 'Thaltej',
    language: 'Gujarati',
    status: 'Open',
    passengerContact: '+91 98250 11234',
    createdAt: '2026-10-10T09:15:00Z',
  },
  // 2. Critical Smoke Emergency (Hindi)
  {
    id: 'GMRC-2026-1002',
    text: 'मोटेरा स्टेडियम मेट्रो स्टेशन के कॉनकोर्स एरिया में एस्केलेटर के पास से काला धुआं और जलने की बदबू आ रही है। लोग घबरा रहे हैं, तुरंत जांच करें!',
    source: 'Social Media',
    station: 'Motera Stadium',
    language: 'Hindi',
    status: 'In Progress',
    passengerContact: '@rahul_amd (Twitter/X)',
    createdAt: '2026-10-10T09:40:00Z',
  },
  // 3. High Harassment (Gujlish)
  {
    id: 'GMRC-2026-1003',
    text: 'Coach number 3 ma ladies seat pase be chhokra harassment ane chhedti karta hata. Security guard ne kahyu to dhyan na apyu. Please take police action.',
    source: 'App',
    station: 'Old High Court',
    language: 'Gujlish',
    status: 'Open',
    passengerContact: '+91 97140 88219',
    createdAt: '2026-10-10T10:05:00Z',
  },
  // 4. Critical Violence / Fight (English)
  {
    id: 'GMRC-2026-1004',
    text: 'Violent physical fight between two passengers at Platform 2 near gate 4. One person bleeding heavily from forehead, immediate police and medical response needed.',
    source: 'Helpdesk',
    station: 'Kalupur Railway Station',
    language: 'English',
    status: 'Open',
    passengerContact: 'Station Helpdesk Log #44',
    createdAt: '2026-10-10T10:20:00Z',
  },
  // 5. Cleanliness Spilled & Glass (English)
  {
    id: 'GMRC-2026-1005',
    text: 'Large puddle of spilled sweet tea and broken glass bottle near escalator landing on Concourse level. High slip hazard for commuters.',
    source: 'App',
    station: 'Vastral Gam',
    language: 'English',
    status: 'In Progress',
    passengerContact: '+91 99099 43210',
    createdAt: '2026-10-10T08:30:00Z',
  },
  // 6. Cleanliness Washroom (Gujarati)
  {
    id: 'GMRC-2026-1006',
    text: 'સ્ટેશન પર શૌચાલયમાં અત્યંત ગંદકી અને દુર્ગંધ છે, ફ્લશ ચાલતું નથી અને પાણી ભરાયેલું છે. સફાઈ સ્ટાફ કોઈ દેખાતો નથી.',
    source: 'Paper',
    station: 'APMC',
    language: 'Gujarati',
    status: 'Open',
    passengerContact: 'Grievance Form Box #12',
    createdAt: '2026-10-09T16:45:00Z',
  },
  // 7. Fare UPI Money Deducted (Gujlish)
  {
    id: 'GMRC-2026-1007',
    text: 'TVM machine ma UPI thi Rs. 50 pay karya, mara account mathi paise cut gaya pan ticket nathi aavi. Gate par token pan na malyu. Refund api dyo.',
    source: 'App',
    station: 'Paldi',
    language: 'Gujlish',
    status: 'Open',
    passengerContact: '+91 94260 55432',
    createdAt: '2026-10-10T07:55:00Z',
  },
  // 8. Fare Gate Rejection (Hindi)
  {
    id: 'GMRC-2026-1008',
    text: 'स्मार्टकार्ड से 30 रुपये कट गए लेकिन ऑटोमैटिक एग्जिट गेट नहीं खुला। दोबारा स्कैन करने पर इनवैलिड टोकन दिखा रहा है। कस्टमर केयर ने अनसुना किया।',
    source: 'Helpdesk',
    station: 'Gandhinagar Sector 1',
    language: 'Hindi',
    status: 'Resolved',
    passengerContact: 'Counter #2 Token ID #9923',
    createdAt: '2026-10-08T11:20:00Z',
  },
  // 9. Lift Accessibility Wheelchair (English)
  {
    id: 'GMRC-2026-1009',
    text: 'Lift from street to concourse has been shut for 3 days. My mother is on a wheelchair and unable to reach the platform. Ramp is also blocked by barricades.',
    source: 'Email',
    station: 'Apparel Park',
    language: 'English',
    status: 'In Progress',
    passengerContact: 'krunal.patel@email.com',
    createdAt: '2026-10-09T14:10:00Z',
  },
  // 10. Escalator Breakdown (Gujarati)
  {
    id: 'GMRC-2026-1010',
    text: 'પ્લેટફોર્મ 1 પર જવાનું એસ્કેલેટર અચાનક આંચકા મારીને બંધ પડી ગયું. લોકો ગભરાઈને લપસી પડ્યા હતા. તાત્કાલિક સમારકામ જરૂરી છે.',
    source: 'App',
    station: 'Ranip',
    language: 'Gujarati',
    status: 'Open',
    passengerContact: '+91 98791 22334',
    createdAt: '2026-10-10T09:50:00Z',
  },
  // 11. Escalator Handrail (Hindi)
  {
    id: 'GMRC-2026-1011',
    text: 'एस्केलेटर की रबर हैंडरेल रुकी हुई है जबकि सीढ़ियां चल रही हैं। बुजुर्गों के हाथ फिसल रहे हैं, बड़ा हादसा हो सकता है।',
    source: 'App',
    station: 'Sabarmati',
    language: 'Hindi',
    status: 'Resolved',
    passengerContact: '+91 98244 55667',
    createdAt: '2026-10-07T15:30:00Z',
  },
  // 12. Staff Behaviour Rude Cashier (Gujlish)
  {
    id: 'GMRC-2026-1012',
    text: 'Ticket counter par betha karmachari bahu rude che. Chutta paisa mangya to dadagiri kare che ane gaali aapi. Senior citizens sathe aavu vartankarvu shobhe nai.',
    source: 'Paper',
    station: 'Commerce Six Road',
    language: 'Gujlish',
    status: 'Open',
    passengerContact: 'Complaint register #88',
    createdAt: '2026-10-09T18:00:00Z',
  },
  // 13. Staff Behaviour Security Guard (Hindi)
  {
    id: 'GMRC-2026-1013',
    text: 'सुरक्षा गार्ड ने बैग चेकिंग के दौरान बहुत बदतमीजी की और चिल्लाया। जब आईडी कार्ड मांगा तो गाली-गलौज करने लगा। उचित कार्रवाई करें।',
    source: 'Social Media',
    station: 'Gujarat University',
    language: 'Hindi',
    status: 'In Progress',
    passengerContact: '@vikas_metro_user',
    createdAt: '2026-10-10T06:40:00Z',
  },
  // 14. Service Delayed Train & No Announcement (Gujarati)
  {
    id: 'GMRC-2026-1014',
    text: 'મોટેરા તરફ જતી ટ્રેન 25 મિનિટથી આવી નથી. પ્લેટફોર્મ પર કોઈ જાહેરાત નથી થતી અને ડિસ્પ્લે સ્ક્રીન પણ બંધ છે. મુસાફરો મુશ્કેલીમાં મુકાયા છે.',
    source: 'App',
    station: 'Vijay Nagar',
    language: 'Gujarati',
    status: 'Resolved',
    passengerContact: '+91 99740 66778',
    createdAt: '2026-10-08T08:15:00Z',
  },
  // 15. Service AC Not Cooling (English)
  {
    id: 'GMRC-2026-1015',
    text: 'Air conditioning inside train rake DM-08 coach 2 is totally off. Extreme heat and suffocation inside the coach during peak office hours.',
    source: 'Email',
    station: 'Gheekanta',
    language: 'English',
    status: 'In Progress',
    passengerContact: 'devang.joshi@corpmail.com',
    createdAt: '2026-10-09T17:10:00Z',
  },
  // 16. Security Pickpocket (Gujarati)
  {
    id: 'GMRC-2026-1016',
    text: 'કાલુપુર સ્ટેશન પર ભીડમાં મારો મોબાઈલ અને પાકીટ ચોરી થઈ ગયા છે. સીસીટીવી ફૂટેજ ચેક કરવા સુરક્ષા સ્ટાફને વિનંતી કરી તો ટાળી દીધું.',
    source: 'Helpdesk',
    station: 'Kalupur Railway Station',
    language: 'Gujarati',
    status: 'Open',
    passengerContact: '+91 94290 12345',
    createdAt: '2026-10-10T10:45:00Z',
  },
  // 17. Cleanliness Gutkha Spit (Gujlish)
  {
    id: 'GMRC-2026-1017',
    text: 'Platform 2 par pillar pase koi ae gutkha thukyu che ane kachro nakhelo che. Swachh metro che to dhyan rakho.',
    source: 'Social Media',
    station: 'Shahpur',
    language: 'Gujlish',
    status: 'Resolved',
    passengerContact: '@mehul_amd_commuter',
    createdAt: '2026-10-06T12:00:00Z',
  },
  // 18. Lift Out of Order (Hindi)
  {
    id: 'GMRC-2026-1018',
    text: 'प्लेटफॉर्म नंबर 2 की लिफ्ट पिछले दो दिनों से बंद पड़ी है। दिव्यांग और वरिष्ठ नागरिकों को सीढ़ियां चढ़ने में भारी कठिनाई हो रही है।',
    source: 'App',
    station: 'Nirant Cross Road',
    language: 'Hindi',
    status: 'In Progress',
    passengerContact: '+91 98980 99881',
    createdAt: '2026-10-09T13:20:00Z',
  },
  // 19. Fare Overcharged QR (English)
  {
    id: 'GMRC-2026-1019',
    text: 'Mobile QR ticket charged twice for a single journey from Thaltej to Vastral Gam. Total 60 deducted instead of 30. Bank reference attached.',
    source: 'App',
    station: 'Thaltej',
    language: 'English',
    status: 'Resolved',
    passengerContact: '+91 98251 77665',
    createdAt: '2026-10-05T09:30:00Z',
  },
  // 20. Staff Refused Assistance (English)
  {
    id: 'GMRC-2026-1020',
    text: 'Station customer care executive refused to guide a visually impaired passenger holding a white cane towards the train door. Very disappointing behavior.',
    source: 'Email',
    station: 'Old High Court',
    language: 'English',
    status: 'In Progress',
    passengerContact: 'anita.sharma@ngo.org',
    createdAt: '2026-10-10T07:15:00Z',
  },
  // 21. Service Signage Missing (Gujarati)
  {
    id: 'GMRC-2026-1021',
    text: 'બસ ટર્મિનલ તરફ જવા માટે કોઈ સાઈન બોર્ડ કે માર્ગદર્શન પાટીયું નથી. નવા મુસાફરો ખોટી દિશામાં બહાર નીકળી જાય છે. યોગ્ય બોર્ડ લગાવો.',
    source: 'Paper',
    station: 'Ranip',
    language: 'Gujarati',
    status: 'Resolved',
    passengerContact: 'Suggestion Card #45',
    createdAt: '2026-10-04T16:00:00Z',
  },
  // 22. Needs Review Ambiguous (Gujlish)
  {
    id: 'GMRC-2026-1022',
    text: 'Station par aavi ne joiyu to aje badhu ajeeb lagtu hatu, kai barabar nathi, jaldi dhyan aapo.',
    source: 'App',
    station: 'Stadium',
    language: 'Gujlish',
    status: 'Open',
    passengerContact: '+91 97230 44556',
    createdAt: '2026-10-10T08:00:00Z',
  },
  // 23. Security Suspicious Bag (Hindi)
  {
    id: 'GMRC-2026-1023',
    text: 'प्लेटफॉर्म 1 के अंतिम छोर पर बेंच के नीचे एक लावारिस बड़ा काला बैग रखा है। आधे घंटे से कोई लेने नहीं आया। तुरंत सुरक्षा जांच करें।',
    source: 'Helpdesk',
    station: 'APMC',
    language: 'Hindi',
    status: 'In Progress',
    passengerContact: 'Passenger via Station Intercom',
    createdAt: '2026-10-10T10:55:00Z',
  },
  // 24. Cleanliness Water Leak Roof (Gujarati)
  {
    id: 'GMRC-2026-1024',
    text: 'છત પરથી ગંદુ પાણી ટપકે છે અને ટિકિટ કાઉન્ટર આગળ મોટો કાદવ થઈ ગયો છે. મુસાફરો લપસી રહ્યા છે, તાત્કાલિક સાફ કરાવો.',
    source: 'App',
    station: 'Thaltej Gam',
    language: 'Gujarati',
    status: 'Open',
    passengerContact: '+91 98254 33221',
    createdAt: '2026-10-10T10:10:00Z',
  },
  // 25. Service Frequency Sunday (English)
  {
    id: 'GMRC-2026-1025',
    text: 'Sunday train interval of 20 minutes is too long. The platforms are overflowing with passengers and trains are packed to dangerous capacity.',
    source: 'Social Media',
    station: 'Motera Stadium',
    language: 'English',
    status: 'Resolved',
    passengerContact: '@bhavik_gujarat',
    createdAt: '2026-10-03T11:00:00Z',
  },
  // 26. Escalator Emergency Stop Triggered (Gujarati)
  {
    id: 'GMRC-2026-1026',
    text: 'કોઈ બાળકના પગરખાં એસ્કેલેટરમાં ફસાતા ઈમરજન્સી સ્વીચ દબાવી પડી. સ્ટાફે સીડી બંધ કરી રાખી છે પણ કોઈ એન્જિનિયર જોવા નથી આવ્યો.',
    source: 'App',
    station: 'Paldi',
    language: 'Gujarati',
    status: 'In Progress',
    passengerContact: '+91 99241 12908',
    createdAt: '2026-10-10T09:00:00Z',
  },
];

export function getGeneratedSyntheticComplaints(): Complaint[] {
  return RAW_SYNTHETIC_DATA.map((item) => {
    const classification = classifyComplaint(item.text, item.station, item.language);
    return {
      id: item.id,
      text: item.text,
      source: item.source,
      station: item.station,
      language: item.language,
      detectedLanguage: classification.detectedLanguage,
      category: classification.category,
      department: classification.department,
      urgencyScore: classification.urgencyScore,
      priority: classification.priority,
      reasons: classification.reasons,
      recommendedAction: classification.recommendedAction,
      responseDraft: classification.responseDraft,
      status: item.status,
      internalNotes: `Demonstration record generated for Gujarat Metro Hacks PS-07 evaluation. Baseline verification: ${classification.priority}`,
      passengerContact: item.passengerContact,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
      isSynthetic: true,
      pendingSync: false,
      syncedAt: '2026-10-10T11:00:00Z',
    };
  });
}
