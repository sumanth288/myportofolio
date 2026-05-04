# NexaFlow Digital - Premium Agency Website

A high-end, visually stunning marketing website with a Flask backend, AI chatbot simulation, and functional contact form.

## Features
- **Premium UI/UX:** Dark theme with neon accents, glassmorphism, and smooth animations (GSAP).
- **Interactive Chatbot:** Built-in chat interface interacting with a Flask backend.
- **Contact Form:** Secure contact form that sends emails via Gmail SMTP.
- **Responsive Design:** Fully mobile-friendly layout.

## Project Structure
```text
project/
├── app.py                 # Flask backend (Chat API, Contact API)
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create from .env.example)
├── templates/
│   └── index.html         # Main HTML layout
└── static/
    ├── css/
    │   └── style.css      # Custom styling and animations
    └── js/
        └── script.js      # Frontend logic (Chat, Form, Animations)
```

## Setup Instructions

1. **Install Dependencies**
   Ensure you have Python 3 installed. Then run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your Gmail SMTP details:
   ```bash
   cp .env.example .env
   ```
   *Note: For Gmail, use an App Password, not your regular account password.*

3. **Run the Application**
   ```bash
   python app.py
   ```
   The app will start at `http://localhost:5000` (or the port specified in `.env`).

## Tech Stack
- Frontend: HTML5, CSS3 (Custom Variables, Flexbox/Grid), Vanilla JS, GSAP (Animations), FontAwesome (Icons)
- Backend: Python, Flask
