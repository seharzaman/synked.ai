# Synked.ai — AI Agent Automation Studio

> Synk Your Business with AI.

Synked.ai is the website for an AI Agent Automation Studio that helps businesses integrate intelligent AI systems into their operations. We design, build, deploy, and continuously manage custom AI systems for real-world business outcomes.

![License](https://img.shields.io/badge/license-Private-red)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Netlify](https://img.shields.io/badge/deployed%20on-Netlify-00C7B7)

---

## Table of Contents

- [Overview](#overview)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Design System](#design-system)

---

## Overview

Synked.ai is a multi-page marketing and demo site showcasing AI automation services. It features interactive demos (a drag-and-drop system builder and a live agent dashboard), scroll-triggered animations, a contact form with email delivery via Nodemailer, and a fully responsive, premium editorial design — all built with **zero JavaScript frameworks**.

### Services Offered

| Service | Description |
|---------|-------------|
| **AI Agents** | Customer support, sales/lead qualification, internal operations bots |
| **RAG Knowledge Systems** | Document intelligence, context-aware responses, private deployment |
| **Workflow Automation** | Business process orchestration and optimization |
| **Integrations** | API connectors and system binding across platforms |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero with animated watercolor blobs, problem/solution pitch, interactive demos, services overview |
| About | `/pages/about.html` | Mission, vision, core values, and team |
| Services | `/pages/services.html` | Detailed breakdown of AI agent, RAG, workflow, and integration services |
| Contact | `/pages/contact.html` | Lead capture form with interests tracking and email delivery |
| System Builder | `/pages/demo-builder.html` | Interactive drag-and-drop node-based AI system builder with real-time metrics |
| Dashboard | `/pages/demo-dashboard.html` | Live agent monitoring dashboard with performance tracking and issue resolution |

---

## Tech Stack

### Frontend

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid/Flexbox, keyframe animations, fluid typography via `clamp()`
- **Vanilla JavaScript** — IntersectionObserver, requestAnimationFrame, Canvas API
- **Lucide Icons** (CDN) — Lightweight SVG icon set
- **Google Fonts** — Cormorant Garamond (display), DM Sans (body), Space Mono (monospace)

### Backend

- **Node.js** / **Express.js** — Local development server, API endpoints
- **Nodemailer** — Email delivery via Gmail/Google Workspace SMTP
- **Netlify Functions** — Serverless contact form handler in production

### Hosting

- **Netlify** — Static site hosting with serverless functions and redirect rules

---

## Project Structure

```
synked.ai/
├── netlify.toml                     # Netlify build config & redirects
├── package.json                     # Root dependencies (Netlify functions)
├── README.md
│
├── netlify/functions/
│   └── contact.js                   # Serverless POST handler for contact form
│
└── synked-integrated/               # Main site (published to Netlify)
    ├── package.json                 # Express, Nodemailer, Nodemon
    ├── server.js                    # Local dev server (port 3000)
    ├── index.html                   # Home page
    │
    ├── pages/
    │   ├── about.html
    │   ├── services.html
    │   ├── contact.html
    │   ├── demo-builder.html
    │   └── demo-dashboard.html
    │
    ├── js/
    │   ├── main.js
    │   └── animations.js            # All animation logic (~400+ lines)
    │
    ├── css/
    │   ├── global.css               # Root variables, nav, base styles
    │   ├── home.css                 # Hero, sections, service cards
    │   ├── about.css                # Mission, values, team
    │   ├── services.css             # Service deep-dives
    │   ├── contact.css              # Form layout
    │   └── animations.css           # Reusable @keyframes
    │
    ├── data/
    │   └── submissions.json         # Contact form submissions archive
    │
    └── assets/
        ├── logo.png
        ├── favicon.png
        └── favicon.ico
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **npm**

### Local Development

```bash
cd synked-integrated
npm install
```

**Start the server:**

```bash
npm start        # Express on http://localhost:3000
```

**Start with auto-reload:**

```bash
npm run dev      # Uses nodemon
```

---

## Deployment

The site is deployed on **Netlify**. Configuration is defined in `netlify.toml`:

- **Publish directory:** `synked-integrated/`
- **Functions directory:** `netlify/functions/`
- **API redirect:** `/api/contact` → `/.netlify/functions/contact`

Push to the connected GitHub repository to trigger an automatic deploy.

---

## Environment Variables

Set these in the Netlify dashboard under **Site settings → Environment variables**:

| Variable | Description |
|----------|-------------|
| `SYNKED_EMAIL` | Gmail/Google Workspace sender email |
| `SYNKED_PASS` | Gmail app password |
| `NOTIFY_TO` | Recipient email for contact form submissions |

For local development, these are configured directly in `server.js`.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--emerald` | `#125842` | Primary actions, trust |
| `--pistachio` | `#7F8C43` | Accent highlights |
| `--bone` | `#EBDCC8` | Warm backgrounds |
| `--cream` | `#F5EEE4` | Light surfaces |
| `--espresso` | `#3F2A1C` | Body text |
| `--taupe` | `#B089AA` | Soft accent |
| `--night` | `#0C1A12` | Dark mode (demos) |

### Typography

| Role | Font | Style |
|------|------|-------|
| Display | Cormorant Garamond | Elegant serif headings |
| Body | DM Sans | Modern sans-serif |
| UI / Labels | Space Mono | Technical monospace |

### Animation Features

- Scroll-triggered reveal animations (IntersectionObserver)
- Morphing watercolor blob backgrounds
- Page curtain transitions
- Magnetic button hover effects
- Floating particles in hero
- Counter number animations
- 3D tilt cards on hover
- Cursor glow trail (desktop)

---

## Target Industries

E-commerce · Healthcare · Real Estate · Startups · SMEs · Agencies
