"""
METRO SAATHI - Synthetic Demo Complaints Dataset
Gujarat Metro Hacks | PS-07
"""

from classifier import classify
from responses import get_draft
from database import insert_complaint, get_connection

DEMO_RECORDS = [
    {
        'id': 'GMRC-2026-1001',
        'text': 'પ્લેટફોર્મ 1 પર લિફ્ટ અચાનક બંધ થઈ ગઈ છે અને અંદર 2 વૃદ્ધ મુસાફરો ફસાયા છે. એલાર્મ વાગી રહ્યો છે પણ કોઈ સ્ટાફ નથી. તાત્કાલિક મદદ મોકલો!',
        'source': 'App',
        'station': 'Thaltej',
        'language': 'Gujarati',
        'status': 'Open',
        'passenger_contact': '+91 98250 11234'
    },
    {
        'id': 'GMRC-2026-1002',
        'text': 'मोटेरा स्टेडियम मेट्रो स्टेशन के कॉनकोर्स एरिया में एस्केलेटर के पास से काला धुआं और जलने की बदबू आ रही है। तुरंत जांच करें!',
        'source': 'Social Media',
        'station': 'Motera Stadium',
        'language': 'Hindi',
        'status': 'In Progress',
        'passenger_contact': '@rahul_amd'
    },
    {
        'id': 'GMRC-2026-1003',
        'text': 'Coach number 3 ma ladies seat pase be chhokra harassment ane chhedti karta hata. Security guard ne kahyu to dhyan na apyu.',
        'source': 'App',
        'station': 'Old High Court',
        'language': 'Gujlish',
        'status': 'Open',
        'passenger_contact': '+91 97140 88219'
    },
    {
        'id': 'GMRC-2026-1004',
        'text': 'Violent physical fight between two passengers at Platform 2 near gate 4. One person bleeding heavily from forehead, immediate police response needed.',
        'source': 'Helpdesk',
        'station': 'Kalupur Railway Station',
        'language': 'English',
        'status': 'Open',
        'passenger_contact': 'Helpdesk Log #44'
    },
    {
        'id': 'GMRC-2026-1005',
        'text': 'Large puddle of spilled sweet tea and broken glass bottle near escalator landing on Concourse level. Commuters are slipping.',
        'source': 'App',
        'station': 'Vastral Gam',
        'language': 'English',
        'status': 'In Progress',
        'passenger_contact': '+91 99099 43210'
    },
    {
        'id': 'GMRC-2026-1006',
        'text': 'સ્ટેશન પર શૌચાલયમાં અત્યંત ગંદકી અને દુર્ગંધ છે, ફ્લશ ચાલતું નથી અને પાણી ભરાયેલું છે. સફાઈ સ્ટાફ કોઈ દેખાતો નથી.',
        'source': 'Paper',
        'station': 'APMC',
        'language': 'Gujarati',
        'status': 'Open',
        'passenger_contact': 'Form #12'
    },
    {
        'id': 'GMRC-2026-1007',
        'text': 'TVM machine ma UPI thi Rs. 50 pay karya, mara account mathi paise cut gaya pan ticket nathi aavi. Gate par token pan na malyu.',
        'source': 'App',
        'station': 'Paldi',
        'language': 'Gujlish',
        'status': 'Open',
        'passenger_contact': '+91 94260 55432'
    },
    {
        'id': 'GMRC-2026-1008',
        'text': 'स्मार्टकार्ड से 30 रुपये कट गए लेकिन ऑटोमैटिक एग्जिट गेट नहीं खुला। कस्टमर केयर ने अनसुना किया।',
        'source': 'Helpdesk',
        'station': 'Gandhinagar Sector 1',
        'language': 'Hindi',
        'status': 'Resolved',
        'passenger_contact': 'Token #9923'
    },
    {
        'id': 'GMRC-2026-1009',
        'text': 'Lift from street to concourse has been shut for 3 days. My mother is on a wheelchair and unable to reach the platform.',
        'source': 'Email',
        'station': 'Apparel Park',
        'language': 'English',
        'status': 'In Progress',
        'passenger_contact': 'krunal.patel@email.com'
    },
    {
        'id': 'GMRC-2026-1010',
        'text': 'પ્લેટફોર્મ 1 પર જવાનું એસ્કેલેટર અચાનક આંચકા મારીને બંધ પડી ગયું. લોકો ગભરાઈને લપસી પડ્યા હતા. તાત્કાલિક સમારકામ જરૂરી છે.',
        'source': 'App',
        'station': 'Ranip',
        'language': 'Gujarati',
        'status': 'Open',
        'passenger_contact': '+91 98791 22334'
    }
]

def seed_demo_data():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM complaints")
    existing_ids = {row[0] for row in cursor.fetchall()}
    conn.close()

    count = 0
    for item in DEMO_RECORDS:
        if item['id'] not in existing_ids:
            c = classify(item['text'], item['station'], item['language'])
            draft = get_draft(c['category'], item['language'], item['id'], item['station'])
            insert_complaint({
                'id': item['id'],
                'text': item['text'],
                'source': item['source'],
                'station': item['station'],
                'language': item['language'],
                'detected_language': c['detected_language'],
                'category': c['category'],
                'department': c['department'],
                'urgency_score': c['urgency_score'],
                'priority': c['priority'],
                'reasons': c['reasons'],
                'recommended_action': c['recommended_action'],
                'response_draft': draft,
                'status': item['status'],
                'passenger_contact': item['passenger_contact'],
                'is_synthetic': True,
                'pending_sync': False
            })
            count += 1
    return count
