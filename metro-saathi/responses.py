"""
METRO SAATHI - Multilingual Response Draft Generator
Gujarat Metro Hacks | PS-07
"""

RESPONSES = {
    'Safety & Security': {
        'English': "Thank you for reporting this safety concern at {station}. Grievance (Ref: {id}) has been assigned priority and routed to the Safety and Security team in the local dashboard for urgent inspection.",
        'Hindi': "{station} पर इस सुरक्षा चिंता की सूचना देने के लिए धन्यवाद। आपकी शिकायत (संदर्भ: {id}) को स्थानीय डैशबोर्ड में सुरक्षा टीम को तत्काल निरीक्षण हेतु अग्रेषित कर दिया गया है।",
        'Gujarati': "{station} ખાતે આ સુરક્ષા બાબતની જાણ કરવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) તાત્કાલિક સ્થળ ચકાસણી માટે સ્થાનિક ડેશબોર્ડમાં સુરક્ષા ટીમને મોકલાઈ છે."
    },
    'Cleanliness': {
        'English': "Thank you for alerting us to the cleanliness issue at {station}. Grievance (Ref: {id}) has been routed to Housekeeping for swift sanitation.",
        'Hindi': "{station} पर स्वच्छता समस्या से अवगत कराने के लिए धन्यवाद। शिकायत (संदर्भ: {id}) हाउसकीपिंग टीम को त्वरित सफाई हेतु सौंप दी गई है।",
        'Gujarati': "{station} ખાતે સફાઈ બાબત ધ્યાને લાવવા બદલ આભાર. ફરિયાદ (સંદર્ભ: {id}) તાત્કાલિક સફાઈ માટે હાઉસકીપિંગ ટીમને સોંપાઈ છે."
    },
    'Fare & Payments': {
        'English': "Thank you for contacting us regarding your fare dispute. Complaint (Ref: {id}) has been logged with Ticketing and Revenue for verification against station logs.",
        'Hindi': "किराया/भुगतान समस्या के लिए संपर्क करने हेतु धन्यवाद। शिकायत (संदर्भ: {id}) टिकटिंग एवं राजस्व विभाग को जांच हेतु भेजी गई है।",
        'Gujarati': "ભાડા અંગે ફરિયાદ કરવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) ચકાસણી માટે ટિકિટિંગ ટીમને મોકલવામાં આવી છે."
    },
    'Lift & Accessibility': {
        'English': "Thank you for reporting the lift issue at {station}. Grievance (Ref: {id}) has been dispatched to Station Maintenance and Accessibility.",
        'Hindi': "{station} पर लिफ्ट खराबी की सूचना हेतु धन्यवाद। शिकायत (संदर्भ: {id}) स्टेशन मेंटेनेंस एवं एक्सेसिबिलिटी विभाग को भेजी गई है।",
        'Gujarati': "{station} ખાતે લિફ્ટની ખામી અંગે આભાર. ફરિયાદ (સંદર્ભ: {id}) સ્ટેશન મેન્ટેનન્સ અને એક્સેસિબિલિટી ટીમને સોંપાઈ છે."
    },
    'Escalator': {
        'English': "Thank you for reporting the escalator issue at {station}. Grievance (Ref: {id}) is routed to Station Maintenance engineering crew.",
        'Hindi': "{station} पर एस्केलेटर खराबी की सूचना देने हेतु धन्यवाद। शिकायत (संदर्भ: {id}) स्टेशन मेंटेनेंस दल को भेजी गई है।",
        'Gujarati': "{station} ખાતે એસ્કેલેટર બંધ હોવા બાબતે આભાર. ફરિયાદ (સંદર્ભ: {id}) સમારકામ માટે એન્જિનિયરિંગ ટીમને મોકલાઈ છે."
    },
    'Staff Behaviour': {
        'English': "Thank you for your feedback regarding staff at {station}. Grievance (Ref: {id}) has been routed to Customer Relations for personnel review.",
        'Hindi': "{station} पर कर्मचारी व्यवहार संबंधी शिकायत दर्ज कर (संदर्भ: {id}) ग्राहक संबंध विभाग को समीक्षा हेतु भेजी गई है।",
        'Gujarati': "{station} ખાતે સ્ટાફના વર્તન અંગે ફરિયાદ (સંદર્ભ: {id}) કસ્ટમર રિલેશન્સ વિભાગને સમીક્ષા માટે સોંપવામાં આવી છે."
    },
    'Service & Information': {
        'English': "Thank you for reaching out regarding train timing or information at {station}. Grievance (Ref: {id}) has been assigned to Passenger Support.",
        'Hindi': "{station} पर ट्रेन समय/सूचना संबंधी शिकायत (संदर्भ: {id}) पैसेंजर सपोर्ट टीम को भेजी गई है।",
        'Gujarati': "{station} ખાતે માહિતી સંબંધિત ફરિયાદ (સંદર્ભ: {id}) પેસેન્જર સપોર્ટ ટીમને સોંપવામાં આવી છે."
    },
    'Other / Needs Review': {
        'English': "Thank you for contacting Gujarat Metro. Your grievance (Ref: {id}) has been recorded in the local dashboard for supervisor triage.",
        'Hindi': "गुजरात मेट्रो से संपर्क करने हेतु धन्यवाद। आपकी शिकायत (संदर्भ: {id}) स्थानीय डैशबोर्ड में समीक्षा हेतु दर्ज की गई है।",
        'Gujarati': "ગુજરાત મેટ્રોનો સંપર્ક કરવા બદલ આભાર. તમારી ફરિયાદ (સંદર્ભ: {id}) સ્થાનિક ડેશબોર્ડમાં નોંધવામાં આવી છે."
    }
}

def get_draft(category: str, language: str = 'English', cid: str = 'GMRC-XXXX', station: str = 'Gujarat Metro') -> str:
    lang_key = 'English'
    if language in ['Gujarati', 'Gujlish']:
        lang_key = 'Gujarati'
    elif language == 'Hindi':
        lang_key = 'Hindi'

    cat_dict = RESPONSES.get(category, RESPONSES['Other / Needs Review'])
    tmpl = cat_dict.get(lang_key, cat_dict['English'])
    return tmpl.replace('{id}', cid).replace('{station}', station)
