import React, { useState, useEffect, useCallback } from 'react';
import { 
  LocationSearchResult, 
  WeatherData, 
  TempUnit, 
  WindUnit 
} from './types';
import { fetchWeatherData, getReverseLocation } from './utils/api';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { AIWeatherBriefing } from './components/AIWeatherBriefing';
import { 
  RotateCw, 
  AlertCircle, 
  MapPin, 
  Sparkles, 
  CloudSun, 
  Compass,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_LOCATION: LocationSearchResult = {
  id: 5391959,
  name: 'San Francisco',
  admin1: 'California',
  country: 'United States',
  country_code: 'US',
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: 'America/Los_Angeles',
};

const SAVED_STORAGE_KEY = 'weather_intelligence_saved_locations';
const UNIT_STORAGE_KEY = 'weather_intelligence_temp_unit';
const WIND_STORAGE_KEY = 'weather_intelligence_wind_unit';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationSearchResult>(() => {
    try {
      const saved = localStorage.getItem('weather_intelligence_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem(UNIT_STORAGE_KEY) as TempUnit) || 'celsius';
  });

  const [windUnit, setWindUnit] = useState<WindUnit>(() => {
    return (localStorage.getItem(WIND_STORAGE_KEY) as WindUnit) || 'kmh';
  });

  const [savedLocations, setSavedLocations] = useState<LocationSearchResult[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [DEFAULT_LOCATION];
    } catch {
      return [DEFAULT_LOCATION];
    }
  });

  const loadWeather = useCallback(async (loc: LocationSearchResult, isSilent: boolean = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await fetchWeatherData(loc);
      setWeather(data);
      setCurrentLocation(loc);
      try {
        localStorage.setItem('weather_intelligence_last_city', JSON.stringify(loc));
      } catch {
        // Storage fail-safe
      }
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err?.message || 'Unable to fetch weather data from Open-Meteo. Please check connection and retry.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(currentLocation);
  }, []);

  const handleToggleTempUnit = (unit: TempUnit) => {
    setTempUnit(unit);
    localStorage.setItem(UNIT_STORAGE_KEY, unit);
  };

  const handleToggleWindUnit = (unit: WindUnit) => {
    setWindUnit(unit);
    localStorage.setItem(WIND_STORAGE_KEY, unit);
  };

  const handleToggleSaveLocation = (loc: LocationSearchResult) => {
    setSavedLocations((prev) => {
      const exists = prev.some((item) => item.id === loc.id || (item.name === loc.name && item.country === loc.country));
      let next: LocationSearchResult[];
      if (exists) {
        next = prev.filter((item) => !(item.id === loc.id || (item.name === loc.name && item.country === loc.country)));
      } else {
        next = [loc, ...prev];
      }
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isCurrentSaved = Boolean(
    currentLocation &&
    savedLocations.some(
      (item) => item.id === currentLocation.id || (item.name === currentLocation.name && item.country === currentLocation.country)
    )
  );

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await getReverseLocation(latitude, longitude);
        await loadWeather(loc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError('Location permission denied or unavailable. You can search any city in the search bar above.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-sky-900 to-emerald-850 text-white font-sans flex flex-col antialiased selection:bg-white/30 selection:text-white relative overflow-x-hidden">
      
      {/* Frosted Glass ambient luminous glow orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 bg-blue-400/25 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[100px] w-96 h-96 bg-teal-300/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-80px] w-80 h-80 bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-[-60px] w-80 h-80 bg-sky-400/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation & Location Search Bar */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={(loc) => loadWeather(loc)}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        windUnit={windUnit}
        onToggleWindUnit={handleToggleWindUnit}
        onRefresh={() => loadWeather(currentLocation, true)}
        isRefreshing={isRefreshing}
        savedLocations={savedLocations}
        onToggleSaveLocation={handleToggleSaveLocation}
        isCurrentSaved={isCurrentSaved}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Error Notification Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-5 rounded-3xl bg-rose-500/20 backdrop-blur-xl border border-rose-400/30 flex items-start justify-between gap-3 text-rose-100 text-xs sm:text-sm shadow-xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadWeather(currentLocation)}
                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium shrink-0 transition-colors border border-white/20 text-xs shadow-sm"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" />
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg" />
              ))}
            </div>
            <div className="h-64 rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" />
            <div className="h-80 rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" />
          </div>
        ) : weather ? (
          <div className="space-y-6 sm:space-y-8">
            
            {/* 1. Live Weather Hero & Deep Metrics Grid */}
            <CurrentWeather
              weather={weather}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 2. AI Weather Intelligence Briefing */}
            <AIWeatherBriefing weather={weather} />

            {/* 3. Hourly 24-Hour Forecast Curve & Timeline */}
            <HourlyForecast
              hourly={weather.hourly}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 4. Weather Intelligence Planning Recommendations (Activities, Outfit, Health & Commute) */}
            <PlanningRecommendations weather={weather} />

            {/* 5. 7-Day Extended Outlook */}
            <DailyForecast
              daily={weather.daily}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

          </div>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/15 mt-12 py-6 text-center text-xs text-white/70 backdrop-blur-md relative z-10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-300" />
            <span>AetherWeather Intelligence • Frosted Glass Edition</span>
          </p>
          <p className="flex items-center gap-2 text-white/60">
            <span>Powered by</span>
            <a 
              href="https://open-meteo.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-teal-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
            >
              Open-Meteo API
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
