# 🧘‍♀️ Baxtli Men — Premium Yoga & Wellness Platform

Baxtli Men is a world-class wellness platform designed for modern women seeking physical health and mental harmony. Led by **Sabina Polatova**, the platform offers an editorial-grade experience across Web, Telegram, and Mobile.

## 🚀 Vision
To provide a "Wellness Concierge" experience through professional yogatherapy, secure video content, and AI-driven personalized support.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion
- **Database**: Neon Postgres (Serverless) with Prisma ORM
- **AI**: Google Gemini (RAG implementation)
- **Infrastructure**: Cloudflare Stream (Secure Video), Click/Payme (Payments)
- **Runtime**: Node.js / Vercel / Netlify

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- pnpm

### 2. Installation
```bash
pnpm install
```

### 3. Setup Environment
Copy `.env.example` to `.env` and fill in the required keys:
```bash
cp .env.example .env
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Running Locally
```bash
pnpm dev
```

## 🏗 Build & Deploy
To create a production-ready build:
```bash
pnpm build
```

## 🌐 Public Preview
**[Live Preview Link]** (Available after deployment)

---

## 🛡️ Security & Privacy
- **Secure Video**: Watermarked and tokenized delivery via Cloudflare.
- **Data Protection**: All admin and sensitive routes are protected by JWT and TG HMAC verification.
- **RAG-based AI**: The AI assistant only responds based on the verified Knowledge Base.

---

© 2026 Baxtli Men. Created by Sabina Polatova.
