"""
METRO SAATHI - Offline SQLite Database Layer
Gujarat Metro Hacks | PS-07: Passenger Grievance Intelligence
"""

import sqlite3
import datetime
from typing import List, Dict, Any, Optional

DB_FILE = "metro_saathi.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        source TEXT NOT NULL,
        station TEXT NOT NULL,
        language TEXT,
        detected_language TEXT,
        category TEXT NOT NULL,
        department TEXT NOT NULL,
        urgency_score INTEGER NOT NULL,
        priority TEXT NOT NULL,
        reasons_json TEXT,
        recommended_action TEXT,
        response_draft TEXT,
        status TEXT NOT NULL,
        internal_notes TEXT,
        passenger_contact TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_synthetic INTEGER DEFAULT 0,
        pending_sync INTEGER DEFAULT 1,
        synced_at TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sync_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        synced_count INTEGER NOT NULL,
        sync_type TEXT NOT NULL,
        notes TEXT
    )
    """)
    conn.commit()
    conn.close()

def generate_next_id() -> str:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    conn.close()
    return f"GMRC-2026-{1001 + count}"

def insert_complaint(complaint_data: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.now().isoformat()
    cid = complaint_data.get("id") or generate_next_id()

    cursor.execute("""
    INSERT INTO complaints (
        id, text, source, station, language, detected_language,
        category, department, urgency_score, priority, reasons_json,
        recommended_action, response_draft, status, internal_notes,
        passenger_contact, created_at, updated_at, is_synthetic, pending_sync
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cid,
        complaint_data["text"],
        complaint_data.get("source", "App"),
        complaint_data.get("station", "Thaltej"),
        complaint_data.get("language", "Auto-detect"),
        complaint_data.get("detected_language", "English"),
        complaint_data["category"],
        complaint_data["department"],
        complaint_data["urgency_score"],
        complaint_data["priority"],
        str(complaint_data.get("reasons", [])),
        complaint_data.get("recommended_action", ""),
        complaint_data.get("response_draft", ""),
        complaint_data.get("status", "Open"),
        complaint_data.get("internal_notes", ""),
        complaint_data.get("passenger_contact", ""),
        complaint_data.get("created_at", now),
        now,
        1 if complaint_data.get("is_synthetic") else 0,
        1 if complaint_data.get("pending_sync", True) else 0
    ))
    conn.commit()
    conn.close()
    return cid

def get_all_complaints() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints ORDER BY created_at DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def update_complaint_status(cid: str, new_status: str, notes: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.now().isoformat()
    if notes is not None:
        cursor.execute("""
        UPDATE complaints SET status = ?, internal_notes = ?, updated_at = ?, pending_sync = 1 WHERE id = ?
        """, (new_status, notes, now, cid))
    else:
        cursor.execute("""
        UPDATE complaints SET status = ?, updated_at = ?, pending_sync = 1 WHERE id = ?
        """, (new_status, now, cid))
    conn.commit()
    conn.close()

def simulate_sync_records() -> int:
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.now().isoformat()
    cursor.execute("SELECT COUNT(*) FROM complaints WHERE pending_sync = 1")
    count = cursor.fetchone()[0]
    cursor.execute("UPDATE complaints SET pending_sync = 0, synced_at = ? WHERE pending_sync = 1", (now,))
    cursor.execute("INSERT INTO sync_logs (timestamp, synced_count, sync_type, notes) VALUES (?, ?, ?, ?)",
                   (now, count, "simulated_local", f"Simulated sync of {count} pending records."))
    conn.commit()
    conn.close()
    return count

def reset_demo_data() -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM complaints WHERE is_synthetic = 1")
    removed = cursor.rowcount
    conn.commit()
    conn.close()
    return removed
