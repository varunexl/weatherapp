import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Lazy-init Gemini client utility
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // AI Weather Intelligence Briefing endpoint
  app.post('/api/weather-insights', async (req, res) => {
    try {
      const { city, country, currentWeather, forecastSummary, activityFocus } = req.body;

      if (!city || !currentWeather) {
        return res.status(400).json({ error: 'City and current weather data are required.' });
      }

      const ai = getAIClient();
      if (!ai) {
        // Return structured deterministic response if no key configured
        return res.json({
          summary: `Currently in ${city}, it's ${currentWeather.temperature}° with ${currentWeather.condition}. Apparent temperature feels like ${currentWeather.apparentTemperature}°.`,
          activityAdvice: `Good conditions for ${activityFocus || 'general outdoor plans'}. Stay hydrated and monitor wind conditions (${currentWeather.windSpeed}).`,
          outfitAdvice: currentWeather.temperature < 10 
            ? 'Layer up with an insulated jacket, scarf, and warm layers.'
            : currentWeather.temperature < 20
            ? 'A light jacket or sweater over comfortable clothes is ideal.'
            : 'Lightweight breathable clothing with sun protection.',
          keyAlert: currentWeather.precipitation > 0 ? 'Precipitation expected. Carry an umbrella or rain shell.' : 'Clear conditions with no immediate precipitation threat.',
          source: 'heuristic'
        });
      }

      const prompt = `You are an elite meteorological intelligence advisor.
Analyze the following weather data for ${city}, ${country || ''}:

Current Conditions:
- Temperature: ${currentWeather.temperature}° (${currentWeather.unit || 'C'})
- Feels Like: ${currentWeather.apparentTemperature}°
- Condition: ${currentWeather.condition} (WMO Code: ${currentWeather.weatherCode})
- Humidity: ${currentWeather.humidity}%
- Wind Speed: ${currentWeather.windSpeed}
- UV Index: ${currentWeather.uvIndex}
- Precipitation: ${currentWeather.precipitation} mm / Probability: ${currentWeather.precipitationProbability}%
- Surface Pressure: ${currentWeather.pressure} hPa

7-Day Forecast Highlight:
${forecastSummary || 'Standard 7-day variation'}

User Activity Focus: ${activityFocus || 'General daily planning, outdoor activities, commuting'}

Provide a structured, engaging, highly practical Meteorological Intelligence Report in JSON format matching this schema:
{
  "summary": "2-3 sentences executive meteorological summary highlighting current feel and trends",
  "activityAdvice": "Specific actionable timing and condition advice tailored to activities like running, cycling, outdoor events",
  "outfitAdvice": "Precise clothing recommendations including layers, footwear, and accessories (e.g. umbrella, sunglasses)",
  "keyAlert": "One primary weather alert or reassuring safety note regarding wind, UV, precipitation, or temperature swings",
  "idealOutdoorWindow": "Estimated best 2-3 hour window today for outdoor endeavors (e.g. '08:00 - 11:00 AM')",
  "source": "gemini"
}
Output strictly valid JSON with no markdown backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const responseText = response.text?.trim() || '{}';
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        parsed = {
          summary: responseText,
          activityAdvice: 'Check hourly forecast for the most optimal windows.',
          outfitAdvice: 'Dress appropriately for the current temperature and conditions.',
          keyAlert: 'Conditions stable.',
          source: 'gemini-raw'
        };
      }

      return res.json({ ...parsed, source: 'gemini' });
    } catch (error: any) {
      console.error('Error generating weather insights:', error);
      return res.status(500).json({
        error: 'Failed to generate AI insights',
        message: error?.message || 'Unknown error',
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running at http://localhost:${PORT}`);
  });
}

startServer();
