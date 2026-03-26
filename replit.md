# KisanConnect Workspace

## Overview

Full-stack pnpm workspace monorepo. KisanConnect is a messaging and information platform for farmers in India, featuring full tri-lingual (English, Hindi, Kannada) i18n support.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/kisan-connect)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: MongoDB Atlas (via Mongoose)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   │   └── src/
│   │       ├── data/       # JSON file storage (community-posts, mandi-prices, schemes)
│   │       └── routes/     # community, prices, schemes, ai, health
│   └── kisan-connect/      # React + Vite frontend
│       └── src/
│           ├── pages/      # Home, Community, Prices, Schemes, AIAssistant, SmsMode
│           └── components/ # Layout, shared UI
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   └── api-zod/            # Generated Zod schemas from OpenAPI
├── scripts/                # Utility scripts
└── pnpm-workspace.yaml
```

## Features

1. **Home Page** — Hero section with farm image, quick-access cards, AI banner, weather, news
2. **Community Feed** (`/community`) — Farmers can post tips/questions/news. Live data from MongoDB
3. **Mandi Prices** (`/prices`) — Crop price table with trend indicators and advanced filters
4. **Government Schemes** (`/schemes`) — PM-KISAN, Fasal Bima, Kisan Credit Card, and more
5. **AI Crop Assistant** (`/ai-assistant`) — GPT-powered streaming chat for farming advice
6. **AgriGo** (`/agrigo`) — External link to AgriGo platform
7. **i18n / Multi-language** — Full trilingual support: English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ)
   - Custom lightweight React Context system (`src/lib/i18n.tsx`)
   - Translation files: `src/locales/en.json`, `hi.json`, `kn.json`
   - Language switcher (🌐 globe icon) in navbar, persistent via localStorage
   - Auto-detects browser language on first visit
   - Lazy-loads Hindi/Kannada translations, English bundled as default
   - Noto Sans Kannada font loaded from Google Fonts for Kannada rendering

## API Endpoints

- `GET /api/community/posts` — List community posts
- `POST /api/community/posts` — Create new post
- `GET /api/prices` — Mandi crop prices
- `GET /api/schemes` — Government schemes
- `POST /api/ai/chat` — AI crop assistant
- `GET /api/healthz` — Health check

## JSON Data Files

All data stored as JSON in `artifacts/api-server/src/data/`:
- `community-posts.json` — Sample posts from farmers across India
- `mandi-prices.json` — Mock crop prices for 5 crops across multiple mandis
- `schemes.json` — 6 government schemes with full details

## Running

- Frontend dev: `pnpm --filter @workspace/kisan-connect run dev`
- Backend dev: `pnpm --filter @workspace/api-server run dev`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
