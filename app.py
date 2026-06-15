"""
Suyash Magdum Portfolio — Flask Backend
Dependencies: flask, psycopg2-binary, python-dotenv
Run: python app.py
"""

from flask import Flask, render_template, request, jsonify
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ── Database connection ──────────────────────────────────────
def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "suyash_portfolio"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "")
    )

def init_db():
    """Create tables if they don't exist."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(200) NOT NULL,
            subject VARCHAR(200),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            read BOOLEAN DEFAULT FALSE
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS page_views (
            id SERIAL PRIMARY KEY,
            page VARCHAR(100),
            user_agent TEXT,
            ip_address VARCHAR(50),
            visited_at TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database initialized.")

# ── Routes ───────────────────────────────────────────────────
@app.route("/")
def index():
    # Log page view
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO page_views (page, user_agent, ip_address) VALUES (%s, %s, %s)",
            ('home', request.headers.get('User-Agent', ''), request.remote_addr)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"View log error: {e}")
    return render_template("index.html")

@app.route("/api/contact", methods=["POST"])
def contact():
    """Handle contact form submissions and store in PostgreSQL."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()

    if not all([name, email, message]):
        return jsonify({"error": "Name, email, and message are required"}), 400

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO contacts (name, email, subject, message, created_at)
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (name, email, subject, message, datetime.now())
        )
        contact_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        print(f"📧 New contact [{contact_id}] from {name} <{email}>")
        return jsonify({"success": True, "id": contact_id, "message": "Message received!"}), 201
    except Exception as e:
        print(f"DB Error: {e}")
        return jsonify({"error": "Failed to save message. Please try again."}), 500

@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    """Admin endpoint — list all contact submissions."""
    # Add auth in production!
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        contacts = [
            {"id": r[0], "name": r[1], "email": r[2],
             "subject": r[3], "message": r[4], "created_at": str(r[5])}
            for r in rows
        ]
        return jsonify(contacts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def stats():
    """Return basic portfolio stats."""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM contacts")
        total_messages = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM page_views")
        total_views = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            "total_messages": total_messages,
            "total_views": total_views,
            "projects": 4,
            "dashboards": 3
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Run ───────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        init_db()
    except Exception as e:
        print(f"⚠️  DB init skipped (check .env): {e}")
    app.run(debug=True, host="0.0.0.0", port=5000)
