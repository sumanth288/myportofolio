"""
NexaFlow Digital Agency - Flask Backend
Handles chatbot API and contact form submission via Gmail SMTP
"""

import os
import json
import random
import smtplib
import re
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, template_folder='.')

# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    """
    Contact form submission endpoint.
    Expects JSON: { name, email, phone, message }
    Sends email via Gmail SMTP.
    """
    try:
        data = request.get_json()

        # --- Input validation ---
        required_fields = ["name", "email", "message"]
        for field in required_fields:
            if not data.get(field, "").strip():
                return jsonify({"success": False, "error": f"'{field}' is required"}), 400

        # Basic email format check
        email_pattern = r"^[^@]+@[^@]+\.[^@]+$"
        if not re.match(email_pattern, data["email"]):
            return jsonify({"success": False, "error": "Invalid email address"}), 400

        name    = data["name"].strip()
        email   = data["email"].strip()
        phone   = data.get("phone", "N/A").strip()
        message = data["message"].strip()

        # --- Email sending via Gmail SMTP ---
        smtp_user = os.getenv("GMAIL_USER")
        smtp_pass = os.getenv("GMAIL_APP_PASSWORD")
        to_email  = os.getenv("CONTACT_TO_EMAIL", smtp_user)

        if smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = f"🚀 New Inquiry from {name} — NexaFlow"
                msg["From"]    = smtp_user
                msg["To"]      = to_email

                html_body = f"""
                <html><body style="font-family:Arial,sans-serif;background:#0a0a0f;color:#e0e0e0;padding:24px;">
                  <div style="max-width:600px;margin:auto;background:#13131f;border-radius:12px;padding:32px;border:1px solid #2a2a3e;">
                    <h2 style="color:#7c3aed;margin-bottom:24px;">New Contact Form Submission</h2>
                    <table width="100%">
                      <tr><td style="padding:8px 0;color:#9ca3af;">Name</td><td style="padding:8px 0;color:#e0e0e0;font-weight:600;">{name}</td></tr>
                      <tr><td style="padding:8px 0;color:#9ca3af;">Email</td><td style="padding:8px 0;color:#7c3aed;">{email}</td></tr>
                      <tr><td style="padding:8px 0;color:#9ca3af;">Phone</td><td style="padding:8px 0;color:#e0e0e0;">{phone}</td></tr>
                    </table>
                    <hr style="border-color:#2a2a3e;margin:24px 0;">
                    <p style="color:#9ca3af;margin-bottom:8px;">Message:</p>
                    <p style="color:#e0e0e0;line-height:1.7;background:#1e1e2e;padding:16px;border-radius:8px;">{message}</p>
                    <p style="margin-top:24px;color:#6b7280;font-size:12px;">Sent from NexaFlow contact form at {datetime.now().strftime('%Y-%m-%d %H:%M')} UTC</p>
                  </div>
                </body></html>
                """
                msg.attach(MIMEText(html_body, "html"))

                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, to_email, msg.as_string())

                app.logger.info(f"Contact email sent for {email}")
            except Exception as smtp_err:
                app.logger.warning(f"SMTP failed (non-critical): {smtp_err}")
                # Don't block user even if email fails — log and continue
        else:
            app.logger.info(f"SMTP not configured. Contact from {name} <{email}>: {message[:80]}")

        return jsonify({
            "success": True,
            "message": "Thank you! We'll get back to you within 24 hours. 🚀"
        })

    except Exception as e:
        app.logger.error(f"Contact error: {e}")
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ─────────────────────────────────────────────────────────────────────────────
# Run
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=port)
