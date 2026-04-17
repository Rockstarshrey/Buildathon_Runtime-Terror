# 🌾 KisanConnect

**AI-powered agricultural advisory platform for Indian farmers**

KisanConnect empowers farmers with real-time mandi prices, government scheme discovery, a multilingual AI farming assistant, community forums, live agri-news, and weather — all in one place and available in 9 Indian languages.

---

## ✨ Features

### 🤖 KisanMitra — AI Farming Assistant
- GPT-powered conversational assistant trained on Indian agricultural context
- Answers questions on crop diseases, pest control, soil health, government schemes, and more
- **Voice input** via Web Speech API — talk instead of type
- **Text-to-speech** for responses in English, Hindi, and Kannada
- Streaming responses for a fast, real-time chat experience
- Quick-start prompts and follow-up suggestions

### 📊 APMC Mandi Prices
- Live market prices sourced from India's APMC mandi network
- Filter by **State** and **Crop Category** (Fruits, Vegetables, Grains, Pulses, Spices, Oilseeds)
- Price trend indicators: 📈 Rising / 📉 Falling / ➡️ Stable
- Searchable by crop name

### 🏛️ Government Schemes
- Database of active Central and State government schemes (PM-KISAN, Fasal Bima, etc.)
- Eligibility criteria, benefit amount, and how-to-apply details
- Fully translated into all 9 supported languages

### 💬 Community Forum
- Farmers can post questions, tips, and local updates
- Like and reply to posts
- Category tagging (crop disease, weather, market, livestock)

### 📰 AgriNews — Live Agricultural News
- Real-time news aggregated from Google News RSS and The Hindu
- Categorized by topic: Policy, Market, Weather, Technology, Crop, Water
- 20-minute server-side cache for fast loading
- Fully translated titles and summaries

### 🌤️ Weather Widget
- Real-time local weather using **Open-Meteo API** (no API key needed)
- Detects location via browser Geolocation (defaults to Bengaluru)
- 7-day forecast with temperature, humidity, and conditions

### 🌐 Multilingual Support — 9 Indian Languages
| Language | Code | Type |
|----------|------|------|
| English | `en` | Static (instant) |
| हिन्दी (Hindi) | `hi` | Static (instant) |
| ಕನ್ನಡ (Kannada) | `kn` | Static (instant) |
| தமிழ் (Tamil) | `ta` | AI-translated |
| తెలుగు (Telugu) | `te` | AI-translated |
| मराठी (Marathi) | `mr` | AI-translated |
| বাংলা (Bengali) | `bn` | AI-translated |
| ਪੰਜਾਬੀ (Punjabi) | `pa` | AI-translated |
| ગુજરાતી (Gujarati) | `gu` | AI-translated |

AI-translated languages are cached in `localStorage` — translations happen once and are reused instantly.

---

## 🛠️ Tech Stack

### Frontend (`artifacts/kisan-connect`)
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations and transitions
- **Wouter** — lightweight client-side routing
- **TanStack Query** — data fetching and caching
- **Radix UI** — accessible UI primitives
- **Lucide React** — icons

### Backend (`artifacts/api-server`)
- **Express.js** + **TypeScript**
- **MongoDB** via Mongoose — community posts and user data
- **OpenAI API** — AI chat (GPT-4o) and translations (gpt-4o-mini)
- **Pino** — structured logging
- **Zod** — request/response validation

### Monorepo
- **pnpm workspaces** — shared packages and unified dependency management
- `@workspace/api-zod` — shared API type definitions
- `@workspace/api-client-react` — typed React hooks for all API routes

---

## 📁 Project Structure

```
├── artifacts/
│   ├── kisan-connect/          # React frontend
│   │   └── src/
│   │       ├── pages/          # Home, Prices, Schemes, Community, AIAssistant, AgriNews, AgriGo
│   │       ├── components/     # Layout, WeatherCard, shared UI
│   │       ├── hooks/          # useTranslate, custom hooks
│   │       └── lib/
│   │           └── i18n.tsx    # 9-language provider with AI translation
│   └── api-server/             # Express backend
│       └── src/
│           ├── routes/
│           │   ├── ai.ts       # KisanMitra chat (streaming SSE)
│           │   ├── prices.ts   # APMC mandi prices
│           │   ├── schemes.ts  # Government schemes
│           │   ├── community.ts # Posts and replies
│           │   ├── news.ts     # AgriNews RSS aggregator
│           │   ├── translate.ts # AI translation endpoint
│           │   └── tts.ts      # Text-to-speech
│           └── data/           # Seed data (prices, schemes, community posts)
├── lib/
│   ├── api-spec/               # OpenAPI specification
│   ├── api-zod/                # Shared Zod schemas
│   └── api-client-react/       # Auto-generated React query hooks
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **pnpm** 8+
- **MongoDB** (local or Atlas URI)
- **OpenAI API Key**

### Installation

```bash
# Clone the repository
git clone https://github.com/buildathon111-ship-it/project.git
cd project

# Install all dependencies
pnpm install
```

### Environment Variables

Create a `.env` file or set these in your environment:

```env
# Required
MONGODB_URI=mongodb+srv://...     # MongoDB connection string
OPENAI_API_KEY=sk-...             # OpenAI API key (for AI chat + translation)

# Optional
DATAGOV_API_KEY=...               # data.gov.in API key (for live APMC prices)
SESSION_SECRET=your-secret-here   # Express session secret
```

### Running in Development

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend (in a separate terminal)
pnpm --filter @workspace/kisan-connect run dev
```

The frontend runs on **http://localhost:5173** and the API server on **http://localhost:8080**.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/prices` | Fetch APMC mandi prices (filter by state/crop) |
| `POST` | `/api/ai/chat` | KisanMitra AI chat (streaming SSE) |
| `GET` | `/api/schemes` | List all government schemes |
| `GET` | `/api/community/posts` | Get community forum posts |
| `POST` | `/api/community/posts/:id/replies` | Add a reply to a post |
| `GET` | `/api/news` | Fetch live agricultural news |
| `POST` | `/api/translate` | Translate text into any supported language |
| `GET` | `/api/tts` | Text-to-speech synthesis |

---

## 🌍 Multilingual Translation Architecture

Static languages (English, Hindi, Kannada) load from local JSON files instantly.

AI languages call `POST /api/translate` with batched texts — the server uses GPT-4o-mini to translate, caches results server-side in memory (Map), and the browser caches in `localStorage` per language. Subsequent visits load instantly from cache.

```
Browser → /api/translate → OpenAI gpt-4o-mini → Cache → Response
                       ↗ Server Map cache (hit → skip OpenAI)
```

---

## 🗣️ Voice & TTS

- **Voice Input**: Uses the Web Speech API (`SpeechRecognition`) — works in Chrome and Edge; respects the currently selected language
- **Text-to-Speech**: `speechSynthesis` for English/Hindi; `/api/tts` endpoint for Kannada

---

## 📦 Built For

**Buildathon 2026** — Empowering Indian farmers with technology

---

## 📄 License

MIT
