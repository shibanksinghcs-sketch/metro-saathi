"""
METRO SAATHI - Offline Deterministic NLP & Urgency Scoring Engine
Gujarat Metro Hacks | PS-07: Passenger Grievance Intelligence
"""

import re
from typing import Dict, Any, List

CATEGORY_KEYWORDS = {
    'Safety & Security': [
        'fire', 'smoke', 'spark', 'bomb', 'theft', 'stolen', 'pickpocket', 'robbery',
        'harassment', 'molest', 'fight', 'violence', 'weapon', 'knife', 'blood',
        'accident', 'injured', 'fall', 'bleeding', 'emergency', 'panic',
        'આગ', 'ધુમાડો', 'ચોરી', 'ખિસ્સાકાતરુ', 'છેડતી', 'ઝઘડો', 'મારામારી', 'હિંસા',
        'હથિયાર', 'લોહી', 'અકસ્માત', 'ઈજા', 'કટોકટી', 'પોલીસ', 'સુરક્ષા',
        'आग', 'धुआं', 'चोरी', 'जेबकतरा', 'छेड़खानी', 'झगड़ा', 'मारपीट', 'हिंसा',
        'हथियार', 'खून', 'दुर्घटना', 'चोट', 'आपातकाल', 'पुलिस', 'सुरक्षा',
        'aag', 'dhumado', 'chori', 'chhedti', 'jhagdo', 'maramari', 'hinsa', 'lohi'
    ],
    'Cleanliness': [
        'dirty', 'garbage', 'trash', 'waste', 'vomit', 'spit', 'gutkha', 'washroom',
        'toilet', 'smell', 'stink', 'cleanliness', 'water leak', 'puddle', 'spilled',
        'ગંદકી', 'કચરો', 'ઉલટી', 'થૂંક', 'ગુટખા', 'શૌચાલય', 'વોશરૂમ', 'દુર્ગંધ', 'વાસ', 'સફાઈ',
        'गंदगी', 'कचरा', 'उल्टी', 'थूक', 'गुटखा', 'शौचालय', 'वॉशरूम', 'बदबू', 'सफाई',
        'gandki', 'kachro', 'kachra', 'ulti', 'thuk', 'gutkha', 'durgandh', 'safai'
    ],
    'Fare & Payments': [
        'fare', 'ticket', 'token', 'smartcard', 'recharge', 'payment', 'upi', 'refund',
        'deducted', 'overcharge', 'tvm', 'vending machine', 'gate rejected',
        'ભાડું', 'ટિકિટ', 'ટોકન', 'સ્માર્ટકાર્ડ', 'રિચાર્જ', 'ચુકવણી', 'રિફંડ', 'પૈસા કપાયા',
        'किराया', 'टिकट', 'टोकन', 'स्मार्टकार्ड', 'रिचार्ज', 'भुगतान', 'रिफंड', 'पैसे कटे',
        'bhadu', 'ticket', 'token', 'smartcard', 'recharge', 'refund', 'paise cut', 'paisa kapaya'
    ],
    'Lift & Accessibility': [
        'lift', 'elevator', 'stuck inside', 'trapped', 'wheelchair', 'ramp', 'disabled',
        'elderly', 'senior citizen', 'blind', 'accessibility', 'divyang',
        'લિફ્ટ', 'એલિવેટર', 'ફસાયા', 'વ્હીલચેર', 'રેમ્પ', 'દિવ્યાંગ', 'વૃદ્ધ', 'અંધ',
        'लिफ्ट', 'एलिवेटर', 'फंसे', 'व्हीलचेयर', 'रैंप', 'दिव्यांग', 'बुजुर्ग',
        'lift', 'lift bandh', 'lift ma fasaya', 'fasai gaya', 'wheelchair nathi'
    ],
    'Escalator': [
        'escalator', 'moving stairs', 'escalator stopped', 'escalator jerking',
        'એસ્કેલેટર', 'સરકતી સીડી', 'સીડી બંધ', 'એસ્કેલેટર બંધ',
        'एस्केलेटर', 'स्वचालित सीढ़ी', 'सीढ़ी बंद', 'एस्કેલેટર બંધ',
        'escalator', 'escalator bandh', 'sidi bandh'
    ],
    'Staff Behaviour': [
        'staff', 'officer', 'guard', 'cashier', 'rude', 'misbehave', 'shouting',
        'abusive', 'slang', 'bribe', 'refused help', 'attitude', 'insult',
        'સ્ટાફ', 'કર્મચારી', 'અધિકારી', 'ગાર્ડ', 'તોછડું', 'ગેરવર્તણૂક', 'દાદાગીરી',
        'कर्मचारी', 'स्टाफ', 'अधिकारी', 'गार्ड', 'बदतमीजी', 'दुर्व्यवहार',
        'staff', 'rude che', 'misbehave karyo', 'dadagiri', 'gaali aapi'
    ],
    'Service & Information': [
        'delay', 'late', 'train frequency', 'announcement', 'display', 'screen',
        'schedule', 'metro timing', 'ac not cooling', 'air conditioning',
        'વિલંબ', 'મોડું', 'સમયપત્રક', 'જાહેરાત', 'ડિસ્પ્લે', 'સ્ક્રીન', 'એસી',
        'देरी', 'लेट', 'समय सारणी', 'घोषणा', 'डिस्प्ले', 'स्क्रीन', 'एसी',
        'late', 'delay che', 'announcement nathi', 'display bandh', 'ac kaam nathi karto'
    ]
}

CATEGORY_TO_DEPT = {
    'Safety & Security': 'Safety and Security',
    'Cleanliness': 'Housekeeping',
    'Fare & Payments': 'Ticketing and Revenue',
    'Lift & Accessibility': 'Station Maintenance and Accessibility',
    'Escalator': 'Station Maintenance',
    'Staff Behaviour': 'Customer Relations',
    'Service & Information': 'Passenger Support',
    'Other / Needs Review': 'General Support'
}

SEVERITY_RULES = [
    {
        'terms': ['fire', 'smoke', 'spark', 'blast', 'bomb', 'આગ', 'ધુમાડો', 'आग', 'धुआं', 'aag'],
        'points': 50,
        'rule': 'Fire/Smoke Hazard',
        'desc': 'Active combustion or smoke hazard detected.'
    },
    {
        'terms': ['trapped', 'stuck inside', 'suffocating', 'ફસાયા', 'फंसे', 'fasaya', 'fasai'],
        'points': 45,
        'rule': 'Entrapment Danger',
        'desc': 'Commuters trapped inside lift or doorway.'
    },
    {
        'terms': ['harassment', 'molest', 'છેડતી', 'छेड़खानी', 'chhedti', 'harass'],
        'points': 40,
        'rule': 'Passenger Harassment',
        'desc': 'Physical or verbal harassment reported.'
    },
    {
        'terms': ['fight', 'violence', 'blood', 'knife', 'મારામારી', 'मारपीट', 'maramari'],
        'points': 38,
        'rule': 'Physical Altercation',
        'desc': 'Violence, assault, or weapon incident.'
    },
    {
        'terms': ['wheelchair', 'elderly', 'divyang', 'વૃદ્ધ', 'દિવ્યાંગ', 'बुजुर्ग', 'bujurg'],
        'points': 20,
        'rule': 'Accessibility Mobility Priority',
        'desc': 'Elderly or Divyang passenger accessibility affected.'
    }
]

def detect_language(text: str) -> str:
    guj_count = len(re.findall(r'[\u0A80-\u0AFF]', text))
    dev_count = len(re.findall(r'[\u0900-\u097F]', text))
    if guj_count > 3:
        return 'Gujarati'
    if dev_count > 3:
        return 'Hindi'
    
    gujlish_markers = ['che', 'chhe', 'nathi', 'thayo', 'thai', 'paisa', 'paise', 'kachro', 'bandh', 'karyo', 'bheed']
    words = [w.lower() for w in re.split(r'\W+', text)]
    if any(m in words for m in gujlish_markers):
        return 'Gujlish'
    return 'English'

def classify(text: str, station: str = "Gujarat Metro", manual_lang: str = None) -> Dict[str, Any]:
    clean = text.strip()
    lower = clean.lower()
    detected_lang = manual_lang if manual_lang and manual_lang != "Auto-detect" else detect_language(clean)

    best_category = 'Other / Needs Review'
    best_score = 0

    for cat, kws in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in kws if kw.lower() in lower)
        if score > best_score:
            best_score = score
            best_category = cat

    dept = CATEGORY_TO_DEPT.get(best_category, 'General Support')

    urgency = 15
    reasons = [{'rule': 'Baseline Intake', 'points': 15, 'desc': 'Standard baseline intake weight.'}]

    cat_weights = {
        'Safety & Security': 30,
        'Lift & Accessibility': 25,
        'Escalator': 15,
        'Cleanliness': 10,
        'Fare & Payments': 10,
        'Staff Behaviour': 12,
        'Service & Information': 8,
        'Other / Needs Review': 5
    }
    cw = cat_weights.get(best_category, 5)
    urgency += cw
    reasons.append({'rule': f'Category Baseline ({best_category})', 'points': cw, 'desc': f'Weight for {best_category}'})

    for srule in SEVERITY_RULES:
        matched = [t for t in srule['terms'] if t in lower]
        if matched:
            urgency += srule['points']
            reasons.append({
                'rule': srule['rule'],
                'points': srule['points'],
                'desc': srule['desc'],
                'matched': matched
            })

    urgency = min(100, max(5, urgency))

    if urgency >= 80:
        priority = 'Critical'
    elif urgency >= 60:
        priority = 'High'
    elif urgency >= 30:
        priority = 'Medium'
    else:
        priority = 'Low'

    rec_action = f"Route to {dept} dispatch desk at {station} within SLA standards."
    if priority == 'Critical':
        rec_action = f"EMERGENCY DISPATCH: Alert Station Controller and Duty Security Supervisor immediately at {station}."

    return {
        'category': best_category,
        'department': dept,
        'urgency_score': urgency,
        'priority': priority,
        'detected_language': detected_lang,
        'reasons': reasons,
        'recommended_action': rec_action
    }
