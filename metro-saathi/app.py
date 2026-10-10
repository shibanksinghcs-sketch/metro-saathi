"""
METRO SAATHI - Streamlit Offline Grievance Intelligence Application
Gujarat Metro Hacks | PS-07: Passenger Grievance Intelligence
Tagline: Every Voice Heard. Every Issue Routed. Every Journey Matters.
"""

import streamlit as st
import pandas as pd
import datetime
from database import (
    init_db, get_all_complaints, insert_complaint, update_complaint_status,
    simulate_sync_records, reset_demo_data
)
from classifier import classify
from responses import get_draft
from demo_data import seed_demo_data

# Initialize DB on load
init_db()

st.set_page_config(
    page_title="METRO SAATHI - Gujarat Metro",
    page_icon="🚇",
    layout="wide"
)

# Custom Styling for Theme
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #115E59 0%, #0F766E 55%, #14B8A6 100%);
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        color: white;
        margin-bottom: 1rem;
    }
    .status-badge {
        background-color: #064E3B;
        color: #34D399;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        display: inline-block;
    }
</style>
""", unsafe_allow_html=True)

# App Header
st.markdown("""
<div class="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 style="margin: 0; font-size: 1.8rem; font-weight: 900; letter-spacing: 1px;">METRO SAATHI</h1>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; opacity: 0.9;">Every Voice Heard. Every Issue Routed. Every Journey Matters. | PS-07</p>
        </div>
        <div style="text-align: right;">
            <div class="status-badge">● OFFLINE MODE (Air-Gapped)</div>
            <div style="font-size: 0.75rem; margin-top: 4px; font-family: monospace;">Local SQLite Active</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Navigation
menu = [
    "Overview",
    "All Complaints",
    "New Complaint",
    "Department Queues",
    "Analytics",
    "Pending Sync",
    "About & Demo Guide"
]
choice = st.sidebar.selectbox("Navigation", menu)

# Sidebar Action Buttons
st.sidebar.markdown("---")
st.sidebar.markdown("**Offline Demonstration Actions**")
if st.sidebar.button("✨ Load 25 Synthetic Records"):
    added = seed_demo_data()
    st.sidebar.success(f"Added {added} records!")
    st.rerun()

if st.sidebar.button("🔄 Reset Demo Records"):
    removed = reset_demo_data()
    st.sidebar.info(f"Reset {removed} demo records.")
    st.rerun()

complaints = get_all_complaints()
df = pd.DataFrame(complaints) if complaints else pd.DataFrame()

# 1. OVERVIEW
if choice == "Overview":
    st.subheader("Grievance Command Overview")
    total = len(df)
    critical = len(df[df['priority'] == 'Critical']) if not df.empty else 0
    open_c = len(df[df['status'] == 'Open']) if not df.empty else 0
    in_prog = len(df[df['status'] == 'In Progress']) if not df.empty else 0
    resolved = len(df[df['status'] == 'Resolved']) if not df.empty else 0
    pending_sync = len(df[df['pending_sync'] == 1]) if not df.empty else 0

    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("Total", total)
    col2.metric("Critical", critical)
    col3.metric("Open", open_c)
    col4.metric("In Progress", in_prog)
    col5.metric("Resolved", resolved)
    col6.metric("Pending Sync", pending_sync)

    st.markdown("---")
    if not df.empty:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("### Top Complaint Categories")
            cat_counts = df['category'].value_counts()
            st.bar_chart(cat_counts)
        with c2:
            st.markdown("### Urgency Distribution")
            urg_counts = df['priority'].value_counts()
            st.bar_chart(urg_counts)

        st.markdown("### High-Priority Grievances")
        high_df = df[df['priority'].isin(['Critical', 'High'])][['id', 'station', 'category', 'urgency_score', 'priority', 'status', 'text']]
        st.dataframe(high_df, use_container_width=True)
    else:
        st.info("No grievances recorded yet. Click 'Load 25 Synthetic Records' in the sidebar.")

# 2. ALL COMPLAINTS
elif choice == "All Complaints":
    st.subheader("All Passenger Grievances")
    if not df.empty:
        col_s, col_cat, col_urg = st.columns(3)
        with col_s:
            search = st.text_input("Search ID, Station or Keywords")
        with col_cat:
            cat_filter = st.selectbox("Category Filter", ["All"] + list(df['category'].unique()))
        with col_urg:
            urg_filter = st.selectbox("Priority Filter", ["All"] + list(df['priority'].unique()))

        filtered_df = df.copy()
        if search:
            filtered_df = filtered_df[filtered_df['text'].str.contains(search, case=False, na=False) |
                                      filtered_df['station'].str.contains(search, case=False, na=False) |
                                      filtered_df['id'].str.contains(search, case=False, na=False)]
        if cat_filter != "All":
            filtered_df = filtered_df[filtered_df['category'] == cat_filter]
        if urg_filter != "All":
            filtered_df = filtered_df[filtered_df['priority'] == urg_filter]

        st.dataframe(filtered_df[['id', 'station', 'category', 'department', 'urgency_score', 'priority', 'status', 'text']], use_container_width=True)

        csv = filtered_df.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Export Filtered CSV", csv, "metro_saathi_complaints.csv", "text/csv")
    else:
        st.info("No complaints found.")

# 3. NEW COMPLAINT
elif choice == "New Complaint":
    st.subheader("Intelligent Grievance Intake")
    with st.form("new_complaint_form"):
        text = st.text_area("Complaint Text (Gujarati, Hindi, English, Gujlish)", placeholder="Type passenger issue here...")
        c1, c2, c3 = st.columns(3)
        with c1:
            station = st.selectbox("Station", ["Thaltej", "Motera Stadium", "Old High Court", "APMC", "Paldi", "Kalupur Railway Station", "Vastral Gam"])
        with c2:
            source = st.selectbox("Channel", ["App", "Social Media", "Email", "Paper", "Helpdesk"])
        with c3:
            contact = st.text_input("Passenger Contact (Optional)")

        submitted = st.form_submit_button("Analyze & Dispatch Grievance")

        if submitted and text.strip():
            res = classify(text, station)
            draft = get_draft(res['category'], res['detected_language'], 'GMRC-NEW', station)
            cid = insert_complaint({
                'text': text,
                'source': source,
                'station': station,
                'category': res['category'],
                'department': res['department'],
                'urgency_score': res['urgency_score'],
                'priority': res['priority'],
                'reasons': res['reasons'],
                'recommended_action': res['recommended_action'],
                'response_draft': draft,
                'passenger_contact': contact
            })
            st.success(f"Complaint {cid} registered and routed to {res['department']}!")
            st.markdown(f"**Urgency Score:** {res['urgency_score']}/100 ({res['priority']})")
            st.markdown(f"**Recommended Action:** {res['recommended_action']}")
            st.text_area("Passenger Response Draft", draft)

# 4. DEPARTMENT QUEUES
elif choice == "Department Queues":
    st.subheader("Department Dispatch Queues")
    if not df.empty:
        dept_counts = df['department'].value_counts()
        for dept, count in dept_counts.items():
            st.markdown(f"### {dept} ({count} tickets)")
            dept_df = df[df['department'] == dept][['id', 'station', 'urgency_score', 'priority', 'status', 'text']]
            st.dataframe(dept_df, use_container_width=True)
    else:
        st.info("No active department queues.")

# 5. ANALYTICS
elif choice == "Analytics":
    st.subheader("Grievance Intelligence Analytics")
    if not df.empty:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("### Languages Detected")
            st.bar_chart(df['detected_language'].value_counts())
        with c2:
            st.markdown("### Complaint Sources")
            st.bar_chart(df['source'].value_counts())
    else:
        st.info("No analytics data available.")

# 6. PENDING SYNC
elif choice == "Pending Sync":
    st.subheader("Pending Synchronization Queue")
    st.info("Local-First Architecture: Records are stored in SQLite and queued locally. No remote server is contacted.")
    if not df.empty:
        pending_df = df[df['pending_sync'] == 1]
        st.write(f"Total Pending Records: {len(pending_df)}")
        if not pending_df.empty:
            st.dataframe(pending_df[['id', 'station', 'category', 'urgency_score', 'status', 'text']], use_container_width=True)
            if st.button("Simulate Local Sync"):
                cnt = simulate_sync_records()
                st.success(f"Simulated local sync for {cnt} records.")
                st.rerun()
    else:
        st.info("No records in sync queue.")

# 7. ABOUT & DEMO GUIDE
elif choice == "About & Demo Guide":
    st.subheader("METRO SAATHI | Gujarat Metro Hacks PS-07")
    st.markdown("""
    **Problem Statement PS-07: Every Complaint Heard**
    - Local air-gapped deterministic categorization
    - Transparent 0-100 explainable urgency scoring
    - Multilingual support: Gujarati, Hindi, English, and Gujlish
    - Local SQLite persistence and pending-sync queue
    - Human-in-the-loop decision-support architecture
    """)
