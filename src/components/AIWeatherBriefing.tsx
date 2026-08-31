import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Shirt, 
  Clock, 
  Zap, 
  Bot
} from 'lucide-react';
import { WeatherData, AIWeatherInsights } from '../types';
import { fetchAIWeatherInsights } from '../utils/api';

interface AIWeatherBriefingProps {
  weather: WeatherData;
}

const PERSONAS = [
  { id: 'General', label: 'Daily Briefing' },
  { id: 'Athletes & Runners', label: 'Athletic & Running' },
  { id: 'Commute & Travel', label: 'Commute & Travel' },
  { id: 'Outdoor Events', label: 'Events & Dining' },
];

export const AIWeatherBriefing: React.FC<AIWeatherBriefingProps> = ({ weather }) => {
  const [selectedPersona, setSelectedPersona] = useState('General');
  const [insights, setInsights] = useState<AIWeatherInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadInsights = async (persona: string) => {
    setIsLoading(true);
    const data = await fetchAIWeatherInsights(weather, persona);
    setInsights(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInsights(selectedPersona);
  }, [weather.location.id, weather.location.name, selectedPersona]);

  return (
    <section id="ai-weather-briefing-section" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white space-y-5 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-teal-200 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                AI Weather Intelligence Briefing
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-teal-200 border border-white/20 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {insights?.source === 'gemini' ? 'Gemini 3.7 Flash' : 'Meteorological Engine'}
              </span>
            </div>
            <p className="text-xs text-white/60">
              Personalized meteorological synthesis for {weather.location.name}
            </p>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border backdrop-blur-md ${
                selectedPersona === p.id
                  ? 'bg-white/30 text-white border-white/40 shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/15'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => loadInsights(selectedPersona)}
            disabled={isLoading}
            title="Re-generate briefing"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-white/70">
          <RotateCw className="w-6 h-6 animate-spin text-teal-300" />
          <p className="text-xs font-medium">Synthesizing meteorological intelligence for {weather.location.name}...</p>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          
          {/* Executive Summary */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-md">
            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-light">
              {insights.summary}
            </p>
          </div>

          {/* 3-Column Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Outdoor Window & Activity */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <Clock className="w-4 h-4" />
                Optimal Window
              </div>
              <p className="text-sm font-bold text-white">
                {insights.idealOutdoorWindow || 'Morning to Midday'}
              </p>
              <p className="text-xs text-white/70 leading-normal">
                {insights.activityAdvice}
              </p>
            </div>

            {/* Gear & Apparel */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-300">
                <Shirt className="w-4 h-4" />
                Outfit & Gear
              </div>
              <p className="text-xs text-white/80 leading-normal">
                {insights.outfitAdvice}
              </p>
            </div>

            {/* Meteorological Alert */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-300">
                <Zap className="w-4 h-4" />
                Advisory Note
              </div>
              <p className="text-xs text-white/80 leading-normal">
                {insights.keyAlert}
              </p>
            </div>

          </div>

        </div>
      ) : null}

    </section>
  );
};
