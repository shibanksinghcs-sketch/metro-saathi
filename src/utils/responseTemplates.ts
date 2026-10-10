import { ComplaintCategory } from '../types/complaint';

export interface ResponseTemplate {
  english: string;
  hindi: string;
  gujarati: string;
}

export const CATEGORY_RESPONSE_TEMPLATES: Record<ComplaintCategory, ResponseTemplate> = {
  'Safety & Security': {
    english:
      'Thank you for reporting this safety concern at {station}. Your grievance (Ref: {id}) has been assigned high priority and routed to the Safety and Security team in the local dashboard for urgent verification and on-site inspection.',
    hindi:
      '{station} पर इस सुरक्षा चिंता की सूचना देने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) को उच्च प्राथमिकता दी गई है और स्थानीय डैशबोर्ड में सुरक्षा एवं संरक्षा टीम को तत्काल निरीक्षण के लिए अग्रेषित कर दिया गया है।',
    gujarati:
      '{station} ખાતે આ સુરક્ષા ચિંતાની જાણ કરવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) ને ઉચ્ચ અગ્રતા આપવામાં આવી છે અને તાત્કાલિક સ્થળ ચકાસણી માટે સ્થાનિક ડેશબોર્ડમાં સુરક્ષા ટીમ તરફ મોકલવામાં આવી છે.',
  },
  'Cleanliness': {
    english:
      'Thank you for bringing this cleanliness issue at {station} to our attention. Your grievance (Ref: {id}) has been assigned to the Housekeeping team in the local dashboard for swift cleaning and sanitization.',
    hindi:
      '{station} पर स्वच्छता संबंधी इस समस्या से अवगत कराने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) को स्थानीय डैशबोर्ड में हाउसकीपिंग टीम को त्वरित सफाई के लिए सौंप दिया गया है।',
    gujarati:
      '{station} ખાતે સ્વચ્છતા સંબંધિત આ બાબત ધ્યાને લાવવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) ને તાત્કાલિક સફાઈ અને સેનિટાઈઝેશન માટે સ્થાનિક ડેશબોર્ડમાં હાઉસકીપિંગ ટીમને સોંપવામાં આવી છે.',
  },
  'Fare & Payments': {
    english:
      'Thank you for contacting us regarding your fare/payment concern. Your complaint (Ref: {id}) has been registered and routed to Ticketing and Revenue in the local dashboard. Our desk will verify transaction logs with station records.',
    hindi:
      'किराया/भुगतान संबंधी समस्या के लिए संपर्क करने हेतु धन्यवाद। आपकी शिकायत (संदर्भ: {id}) दर्ज कर स्थानीय डैशबोर्ड में टिकटिंग एवं राजस्व विभाग को भेज दी गई है। स्टेशन रिकॉर्ड के साथ लेनदेन की पुष्टि की जाएगी।',
    gujarati:
      'ભાડા/ચુકવણી અંગેની ફરિયાદ નોંધાવવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) નોંધીને સ્થાનિક ડેશબોર્ડમાં ટિકિટિંગ અને રેવેન્યુ ટીમને મોકલવામાં આવી છે. સ્ટેશન રેકોર્ડ સાથે વેરિફિકેશન કરવામાં આવશે.',
  },
  'Lift & Accessibility': {
    english:
      'Thank you for alerting us to the lift/accessibility issue at {station}. Grievance (Ref: {id}) has been dispatched to Station Maintenance and Accessibility in the local dashboard. Station personnel are directed to assist passengers needing accessible transit.',
    hindi:
      '{station} पर लिफ्ट/सुलभता समस्या से अवगत कराने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) को स्थानीय डैशबोर्ड में स्टेशन मेंटेनेंस एवं एक्सेसिबिलिटी विभाग को भेजा गया है। दिव्यांग यात्रियों की सहायता हेतु स्टेशन स्टाफ को सूचित किया गया है।',
    gujarati:
      '{station} ખાતે લિફ્ટ/દિવ્યાંગ સુવિધાની ખામી અંગે જાણ કરવા બદલ આભાર. ફરિયાદ (સંદર્ભ: {id}) સ્થાનિક ડેશબોર્ડમાં મેન્ટેનન્સ અને એક્સેસિબિલિટી ટીમને ફાળવવામાં આવી છે. સહાયની જરૂર હોય તેવા મુસાફરો માટે સ્ટાફને સુચિત કરાયો છે.',
  },
  'Escalator': {
    english:
      'Thank you for reporting the escalator breakdown at {station}. Complaint (Ref: {id}) has been forwarded to the Station Maintenance engineering crew in the local dashboard for mechanical inspection and restoration.',
    hindi:
      '{station} पर एस्केलेटर संबंधी खराबी की सूचना देने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) को स्थानीय डैशबोर्ड में स्टेशन मेंटेनेंस इंजीनियरिंग दल को तकनीकी जांच के लिए भेज दिया गया है।',
    gujarati:
      '{station} ખાતે એસ્કેલેટર બંધ હોવાની જાણ કરવા બદલ આભાર. ફરિયાદ (સંદર્ભ: {id}) સ્થાનિક ડેશબોર્ડમાં સ્ટેશન મેન્ટેનન્સ એન્જિનિયરિંગ ટીમને તાત્કાલિક સમારકામ માટે મોકલવામાં આવી છે.',
  },
  'Staff Behaviour': {
    english:
      'Thank you for sharing your feedback regarding staff interaction at {station}. Grievance (Ref: {id}) has been escalated to Customer Relations in the local dashboard. Gujarat Metro maintains high standards of passenger courtesy and will review station logs.',
    hindi:
      '{station} पर कर्मचारी व्यवहार संबंधी अनुभव साझा करने के लिए धन्यवाद। शिकायत (संदर्भ: {id}) को स्थानीय डैशबोर्ड में ग्राहक संबंध (कस्टमर रिलेशंस) विभाग को भेजा गया है। मेट्रो प्रशासन यात्रियों के साथ सौम्य व्यवहार हेतु प्रतिबद्ध है।',
    gujarati:
      '{station} ખાતે સ્ટાફના વર્તન અંગે પ્રતિસાદ આપવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) સ્થાનિક ડેશબોર્ડમાં કસ્ટમર રિલેશન્સ વિભાગને સોંપવામાં આવી છે. મુસાફરો સાથે આદરપૂર્ણ વ્યવહાર સુનિશ્ચિત કરવા બાબતે સમીક્ષા કરવામાં આવશે.',
  },
  'Service & Information': {
    english:
      'Thank you for reaching out regarding train timing or passenger information at {station}. Grievance (Ref: {id}) has been recorded with Passenger Support in the local dashboard to ensure accurate announcements and digital display updates.',
    hindi:
      '{station} पर ट्रेन समय अथवा यात्री सूचना संबंधी समस्या की जानकारी देने के लिए धन्यवाद। शिकायत (संदर्भ: {id}) को पैसेंजर सपोर्ट टीम को सटीक घोषणाओं और डिस्प्ले सुधार हेतु सौंप दिया गया है।',
    gujarati:
      '{station} ખાતે ટ્રેન સમય અથવા મુસાફર માહિતી સંબંધિત પ્રશ્ન અંગે આભાર. ફરિયાદ (સંદર્ભ: {id}) પેસેન્જર સપોર્ટ ટીમને સોંપવામાં આવી છે જેથી સાચી જાહેરાતો અને ડિસ્પ્લે અપડેટ સુનિશ્ચિત કરી શકાય.',
  },
  'Other / Needs Review': {
    english:
      'Thank you for reporting this issue. Your complaint (Ref: {id}) has been recorded in the local dashboard and flagged for General Support supervisor review. Please retain your reference number for status tracking.',
    hindi:
      'इस समस्या की जानकारी देने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) स्थानीय डैशबोर्ड में दर्ज कर सामान्य सहायता (जनरल सपोर्ट) पर्यवेक्षक समीक्षा के लिए रखी गई है। संदर्भ संख्या सुरक्षित रखें।',
    gujarati:
      'આ સમસ્યાની જાણ કરવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) સ્થાનિક ડેશબોર્ડમાં નોંધવામાં આવી છે અને સુપરવાઈઝર સમીક્ષા માટે રાખવામાં આવી છે. આગળની માહિતી માટે સંદર્ભ નંબર સાચવી રાખો.',
  },
};

export function generateResponseDraft(
  category: ComplaintCategory,
  language: 'Gujarati' | 'Hindi' | 'English' | 'Gujlish' | 'Other',
  complaintId: string = 'GMRC-XXXX',
  station: string = 'Station'
): string {
  const templates = CATEGORY_RESPONSE_TEMPLATES[category] || CATEGORY_RESPONSE_TEMPLATES['Other / Needs Review'];
  let template = templates.english;

  if (language === 'Gujarati' || language === 'Gujlish') {
    template = templates.gujarati;
  } else if (language === 'Hindi') {
    template = templates.hindi;
  } else {
    template = templates.english;
  }

  return template
    .replace('{id}', complaintId)
    .replace('{station}', station || 'Gujarat Metro');
}
