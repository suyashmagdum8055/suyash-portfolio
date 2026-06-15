# 🚀 Suyash Magdum Portfolio

A stunning full-stack portfolio website for Data Science & AI projects.

**Stack:** Python · Flask · PostgreSQL · HTML/CSS/JS

---

## Quick Setup

### 1. Clone & install
```bash
git clone <your-repo>
cd suyash_portfolio
pip install -r requirements.txt
```

### 2. Set up PostgreSQL
```sql
CREATE DATABASE suyash_portfolio;
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials
```

### 4. Run
```bash
python app.py
# Visit http://localhost:5000
```

### For production (Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## Project Structure
```
suyash_portfolio/
├── app.py                  # Flask backend
├── requirements.txt
├── .env.example
├── templates/
│   └── index.html          # Main portfolio page
└── static/
    ├── css/style.css       # All styles
    ├── js/main.js          # Interactions & animations
    └── images/             # Dashboard screenshots
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Portfolio homepage |
| POST | `/api/contact` | Submit contact form (saves to PostgreSQL) |
| GET | `/api/contacts` | List all messages (admin) |
| GET | `/api/stats` | Portfolio stats |
