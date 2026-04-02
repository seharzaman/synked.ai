# Synked.ai — Website

A full multi-page website for Synked.ai, built with HTML/CSS/JS + Node.js/Express backend.

---

## 📁 Project Structure

```
synked-ai/
├── index.html              ← Home page
├── pages/
│   ├── about.html          ← About page
│   ├── services.html       ← Services page
│   └── contact.html        ← Contact page
├── css/
│   ├── global.css          ← Shared styles, nav, footer, buttons
│   ├── home.css            ← Hero, watercolor effects, sections
│   ├── services.css        ← Services deep dive, pricing
│   ├── about.css           ← Mission, values, team, roadmap
│   └── contact.css         ← Contact form, process steps
├── js/
│   └── main.js             ← Nav scroll, reveal animations, interactions
├── server.js               ← Node.js/Express backend
├── package.json
└── data/
    └── submissions.json    ← Auto-created on first form submission
```

---

## 🚀 How to Run

### Option A — With Node.js Backend (Recommended)
Enables the contact form API to save submissions.

**Prerequisites:** Node.js v16+ installed  
Download from: https://nodejs.org

```bash
# 1. Navigate to the project folder
cd synked-ai

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# http://localhost:3000
```

**For development (auto-restart on file changes):**
```bash
npm run dev
```

---

### Option B — Static Only (No backend needed)
Works perfectly for browsing all pages. Contact form gracefully falls back.

Simply open `index.html` in your browser — no installation needed.
Or use VS Code's **Live Server** extension for hot-reload.

---

## 🌐 Pages

| Page | URL |
|------|-----|
| Home | `/index.html` |
| About | `/pages/about.html` |
| Services | `/pages/services.html` |
| Contact | `/pages/contact.html` |

---

## 🎨 Brand Palette

| Name | Hex |
|------|-----|
| Warm Bone | `#EBDCC8` |
| Greige-Taupe | `#B089AA` |
| Deep Emerald | `#125842` |
| Pistachio Green | `#7F8C43` |
| Espresso | `#3F2A1C` |

---

## 📬 Contact Form Submissions

When running with Node.js, form submissions are saved to `data/submissions.json`.

View all submissions via:
```
GET http://localhost:3000/api/submissions
```

**⚠️ For production:** Replace the file-based storage with a real database (MongoDB, PostgreSQL, Supabase, etc.) and add authentication to the `/api/submissions` endpoint.

---

## 🌍 Deploying to Production

### Vercel / Netlify (Static)
- Upload the folder, set `index.html` as root
- Contact form will use graceful fallback (no backend)

### Railway / Render / Fly.io (Full Stack)
- Push to GitHub
- Connect to Railway/Render
- Set start command: `npm start`
- Set port: `3000`

### Environment Variables (optional)
```env
PORT=3000
```

---

## ✨ Features

- **Overlapping scroll effects** — Sticky sections, parallax watercolor blobs
- **CSS animations** — Staggered hero entrance, scroll-triggered reveals
- **Morphing watercolor blobs** — Brand-consistent organic shapes
- **Ticker marquee** — Looping service labels in brand emerald
- **Interactive service cards** — Hover states with sliding accent bars
- **Animated chat widget** — Typing indicator on services page
- **Fully responsive** — Mobile hamburger menu, single-column layouts
- **Contact form** — With validation, checkbox interests, success state
- **Cursor glow** — Subtle ambient cursor effect on desktop

---

Built with care for Synked.ai — synk Your Business with AI.
