# AetherWeather Intelligence 🌤️

A smart, full-stack weather intelligence application with a frosted glass design, real-time Open-Meteo meteorological telemetry, 24-hour hourly trend visualizers, 7-day extended forecasts, lifestyle and activity suitability analytics, and AI-powered weather briefings powered by Google Gemini.

---

## ✨ Features

- **Frosted Glass Aesthetic**: Multi-layered backdrop blur cards, ambient luminous glow accents, and responsive layout.
- **Global Search & Geolocation**:
  - Instant city and coordinate autocomplete via Open-Meteo Geocoding API.
  - One-click GPS location detection with reverse geocoding.
  - Quick-preset chips for major international destinations.
  - Favorites and saved locations drawer with local persistence.
- **Real-Time Atmospheric Telemetry**:
  - Real temperature, apparent feels-like temperature, and WMO weather condition iconography.
  - Humidity, dew point, wind vectors (speed, direction, and peak gusts), UV index risk levels, barometric pressure, visibility, and air quality (US AQI / PM2.5).
  - Daylight duration, sunrise, and sunset tracking.
- **24-Hour Interactive Forecast**:
  - Interactive area chart with tabs for **Temperature**, **Precipitation Probability**, and **Wind Speeds** using Recharts.
  - Horizontal scrollable hourly cards with condition icons, precipitation badges, and wind metrics.
- **7-Day Extended Outlook**:
  - Proportional temperature range bars comparing weekly highs and lows.
  - Detailed daily inspection modals with rainfall accumulation, UV index peaks, dominant wind vectors, and daylight timings.
- **Planning & Lifestyle Intelligence**:
  - **Outdoor Activity Ratings**: Suitability scores and optimal time windows for running, cycling, walking, dining, photography, and outdoor events.
  - **Outfit Advisor**: Layering strategies, footwear recommendations, and gear alerts (umbrella, sunscreen).
  - **Health & Commute Analytics**: Thermal comfort sensations, UV safe exposure limits, barometric migraine risk assessment, and road commute safety indicators.
- **AI Weather Intelligence Briefing**:
  - Server-side Gemini 3.7 Flash synthesis providing personalized summaries, optimal outdoor windows, outfit strategies, and advisory notes.
  - Persona filtering: Daily Briefing, Athletes & Runners, Commute & Travel, and Outdoor Events.
  - Robust heuristic fallback engine when offline or if an API key is not configured.
- **Dynamic Unit Switching**:
  - Instant toggle between Celsius (°C) and Fahrenheit (°F).
  - Configurable wind speed units (km/h, mph, m/s).

---

## 🛠️ Technology Stack

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Recharts](https://recharts.org/) (interactive meteorological charts)
  - [Motion](https://motion.dev/) (fluid animations and transitions)
  - [Lucide React](https://lucide.dev/) (clean vector icons)
- **Backend & APIs**:
  - [Express](https://expressjs.com/) (Node.js backend proxy)
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gen AI SDK for Gemini 3.7 Flash)
  - [Open-Meteo Weather API](https://open-meteo.com/) (free, open-access meteorological data & geocoding)
  - [Vite](https://vitejs.dev/) + [tsx](https://github.com/privatenumber/tsx) + [esbuild](https://esbuild.github.io/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional for AI briefings):
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally

Start the full-stack development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build

Build the client assets with Vite and bundle the server using esbuild:
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check endpoint returning server status and timestamp. |
| `/api/weather-insights` | `POST` | Generates a structured meteorological intelligence briefing via Gemini 3.7 Flash. |

---

## ⚙️ Environment Variables

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for AI weather briefings. |
| `APP_URL` | Self-referential URL of the deployed application. |
| `PORT` | Server listening port (default `3000`). |

---

## 📄 License

MIT License. Meteorological data provided by [Open-Meteo](https://open-meteo.com/).
