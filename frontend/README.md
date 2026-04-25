<div align="center">

# 🌑 ShadowSkills

### *Stop guessing your skills. Start observing them.*

**AI-powered developer profiling — based on what you do, not what you claim.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-F55036?style=flat-square)](https://groq.com)
[![GitHub API](https://img.shields.io/badge/Data-GitHub%20API-181717?style=flat-square&logo=github)](https://docs.github.com/en/rest)

</div>

---

## 🔍 What is ShadowSkills?

Most developers don't know what they're actually good at. Resumes are guesswork. ShadowSkills fixes that by **inferring your real skills from your digital behavior** — your GitHub commits, your patterns, your consistency — not from what you write about yourself.

> No forms. No self-rating. Just your GitHub and the truth.
> Primary users : students
> secondary users : HR / Recruiters
---

## 📸 Preview

| Landing | Dashboard |
|--------|-----------|
| ![Landing](screenshots/1_ss.jpeg) | ![Dashboard](screenshots/6_ss.jpeg) |

| Insights | Career Suggestions |
|---------|-------------------|
| ![Insights](screenshots/5_ss.jpeg) | ![Career](screenshots/4_ss.jpeg) |

| Badges | Time Breaker |
|--------|-------------|
| ![Badges](screenshots/3_ss.jpeg) | ![TimeBreaker](screenshots/2_ss.jpeg) |

| Cron Status | Unstop Integration |
|------------|-------------------|
| ![Cron](screenshots/7_ss.jpeg) | ![Unstop](screenshots/8_ss.jpeg) |

---

## ✨ Features

### 📊 Dashboard
Real-time overview with **Consistency Score**, **Confidence Score**, public repos, followers, and a 7-day activity bar chart — all derived from actual GitHub data.

### 🕸️ Skill Radar
Hexagonal radar chart mapping your skills across Logic, Speed, Consistency, Time Spent, Focus, and Persistence — inferred from commit patterns, not self-assessment.

### 🧠 Insights
AI-generated **hidden strengths** and **blind spots** based on your actual repositories and commit history. Powered by Groq's LLaMA 3.1.

### 📁 Projects
All your GitHub repositories in one place — with language tags, descriptions, stars, and forks.

### 📈 Activity
7-day commit heatmap + full recent commit log with timestamps and repo references.

### 💼 Career Suggestions
Role recommendations matched to your behavioral patterns. Integrated with **Unstop** to surface real internship and job listings with match scores and auto-apply.

### 🏅 Badges
Earn badges based on real behavior — Focus Master, Consistent Coder, Early Bird, Guardian Reviewer, Momentum Streak, and more.

### ⚡ Time Breaker
Leaderboard of your **top 5 fastest consecutive commits** — ranked by time gap between commits in the same repo. With podium, date, time, and commit message.

### 🔄 Cron Status
Background scheduler that automatically re-analyses all tracked users every 24 hours. View tracked users, next run time, and full cron logs.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Chart.js |
| Backend | FastAPI + Python |
| AI | Groq API (LLaMA 3.1 8B Instant) |
| Data | GitHub REST API |
| Scheduler | APScheduler (cron every 24h) |
| Career | Unstop API (mock for demo) |
| Social | LinkedIn Activity (mock for demo) |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/shadowskills.git
cd shadowskills
```

### 2. Backend setup
```bash
cd backend
pip install fastapi uvicorn groq apscheduler python-dotenv requests
```

Create a `.env` file in `/backend`:
```
GROQ_API_KEY=your_groq_key_here
GITHUB_TOKEN=
CRON_INTERVAL_HOURS=24
```

Run the backend:
```bash
python -m uvicorn main:app --reload --port 8001
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) — enter any GitHub username and go.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analyze/{username}` | Full GitHub + AI analysis |
| `GET` | `/cache/{username}` | Serve cached result instantly |
| `GET` | `/time-breaker/{username}` | Top 5 fastest commit intervals |
| `POST` | `/linkedin/login` | Demo LinkedIn login |
| `GET` | `/mock/full/{username}` |  Unstop data |
| `POST` | `/track/{username}` | Register for auto re-analysis |
| `GET` | `/cron/status` | Scheduler health + next run |
| `POST` | `/cron/trigger` | Manually fire cron run |

---

## 👥 Team

**Terminal.exe**

Built at **Athernex Hackathon** · Track: AI & Productivity

---

<div align="center">
  <sub>Your GitHub is already your best resume. We just read it for you.</sub>
</div>
