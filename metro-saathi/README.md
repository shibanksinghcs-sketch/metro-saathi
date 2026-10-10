# METRO SAATHI — Gujarat Metro Hacks | PS-07

> **Tagline:** Every Voice Heard. Every Issue Routed. Every Journey Matters.  
> **Problem Statement:** PS-07 — Passenger Grievance Intelligence & Offline Dispatch  
> **Target Metro Network:** Gujarat Metro Rail Corporation (GMRC) — Ahmedabad & Surat Metro

---

## 1. Project Purpose

Metro passenger grievances arrive constantly through mobile apps, social media, customer support desks, station paper forms, and intercoms. They arrive written in **Gujarati**, **Hindi**, **English**, or mixed **Gujlish** (transliterated Gujarati). In underground tunnels, elevated concourses, and field inspection terminals, internet connectivity can be absent or degraded.

**METRO SAATHI** is an offline-first, explainable decision-support web application that:
1. Operates 100% offline with zero cloud API dependencies, zero online font calls, and zero external CDNs.
2. Accurately categorizes grievances across all 8 Gujarat Metro operational departments.
3. Computes a transparent, explainable **Urgency Score (0–100)** with keyword and rule breakdowns.
4. Generates editable multilingual response drafts in Gujarati, Hindi, and English.
5. Manages an air-gapped **Pending-Sync Queue** for reliable data handshakes when connectivity is restored.
6. Provides one-click CSV export/import for sneaker-net / USB transit between stations.

---

## 2. Key Features

- **Zero Cloud Runtime Dependency:** Runs with Wi-Fi and mobile data completely disabled.
- **Multilingual Support:** Native Gujarati script (ગુજરાતી), Hindi (हिंदी), English, and Gujlish transliteration.
- **Explainable Urgency Scoring (0–100):**
  - **Critical (80–100):** Immediate life hazard, smoke, fire, lift entrapment, or violent altercation.
  - **High (60–79):** Broken escalator, slip and fall risks, wheelchair access barrier.
  - **Medium (30–59):** Ticket vending machine delay, UPI fare deduction, staff rudeness.
  - **Low (0–29):** General inquiry, minor schedule query.
- **Department Routing:**
  - *Safety & Security* → Safety and Security
  - *Cleanliness* → Housekeeping
  - *Fare & Payments* → Ticketing and Revenue
  - *Lift & Accessibility* → Station Maintenance and Accessibility
  - *Escalator* → Station Maintenance
  - *Staff Behaviour* → Customer Relations
  - *Service & Information* → Passenger Support
  - *Other / Needs Review* → General Support
- **Multilingual Response Drafting:** Local templates interpolating complaint ID and station name in English, Hindi, and Gujarati.
- **Offline Storage:** SQLite-compatible persistent storage surviving application restarts.
- **Bulk CSV Upload & Export:** Ingest batches of complaints from station suggestion boxes.
- **Genuine Light / Dark Mode:** Designed around official color psychology guidelines.

---

## 3. Technology Stack

- **Modern Web Application (AI Studio Live Preview):** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite, LocalStorage / IndexedDB relational store.
- **Standalone Python Companion (`metro-saathi/`):** Python 3.10+, Streamlit, SQLite3, Pandas.

---

## 4. Exact Launch & Installation Commands

### Option A: Web Application (Default AI Studio Environment)
The web application is already installed and runnable in the AI Studio environment on port 3000:
```bash
# In the project root directory
npm install
npm run dev
```
Open `http://localhost:3000` in any web browser.

### Option B: Standalone Python + Streamlit CLI
To run the Python companion script:
```bash
# Navigate to the python directory
cd metro-saathi

# Install lightweight dependencies
pip install -r requirements.txt

# Launch Streamlit app
streamlit run app.py
```
Open `http://localhost:8501`.

---

## 5. Offline Demonstration Instructions for Judges

To test and verify the 100% offline requirement:
1. Launch the application in your browser.
2. **Turn OFF your Wi-Fi, disconnect Ethernet, or turn on Airplane Mode.**
3. Refresh the page or click around the navigation tabs.
4. Observe the green **`OFFLINE MODE`** badge in the header.
5. Click **"Load 25 Synthetic Records"** in the sidebar. All 25 multilingual complaints populate instantly.
6. Go to **"New Complaint"** and click any of the preset cases:
   - 🚨 *Gujarati:* "પ્લેટફોર્મ 1 પર લિફ્ટ અચાનક બંધ થઈ ગઈ છે અને અંદર 2 વૃદ્ધ મુસાફરો ફસાયા છે..."
   - ⚠️ *Hindi:* "मोटेरा स्टेडियम मेट्रो स्टेशन के कॉनકોર્સ एरिया में काला धुआं आ रहा है..."
   - 💳 *Gujlish:* "TVM machine ma UPI thi Rs. 50 pay karya, paise cut gaya pan ticket nathi aavi..."
7. Observe instant offline categorization, urgency score, scoring rule breakdown, and localized response drafts.
8. Click **"Register & Dispatch Grievance"**.
9. Go to **"Pending Sync"** and observe the complaint in the local queue.
10. Click **"Export Pending (CSV)"** to verify offline data export.
11. Click **"Simulate Local Sync"** to mark the item as synced locally.
12. Toggle between **Light and Dark theme** using the sun/moon button in the top header.

---

## 6. Known Limitations & Decision-Support Notice

- **Decision Support Prototype:** Automated classifications and urgency scores assist station controllers and supervisors; they are **not** autonomous emergency dispatch triggers. Real-world emergency protocols require verified human verification before dispatching first responders.
- **Simulated Sync:** The local synchronization feature operates within local browser/SQLite storage and records audit logs; it does not contact a live central transit server.

---

*Gujarat Metro Hacks 2026 | PS-07 Passenger Grievance Intelligence*
