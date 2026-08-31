import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Shirt, 
  HeartPulse, 
  Car, 
  Umbrella, 
  Sun, 
  CheckCircle2, 
  Clock, 
  Footprints,
  Bike,
  UtensilsCrossed,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { WeatherData } from '../types';
import { 
  computeActivityRecommendations, 
  computeOutfitRecommendations, 
  computeHealthAndComfort 
} from '../utils/weatherIntelligence';

interface PlanningRecommendationsProps {
  weather: WeatherData;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'outfit' | 'health'>('activities');

  const activities = computeActivityRecommendations(weather);
  const outfit = computeOutfitRecommendations(weather);
  const health = computeHealthAndComfort(weather);

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-sky-200" />;
      case 'Bike': return <Bike className="w-5 h-5 text-teal-200" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-emerald-200" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-amber-200" />;
      case 'Camera': return <Camera className="w-5 h-5 text-indigo-200" />;
      default: return <Sparkles className="w-5 h-5 text-purple-200" />;
    }
  };

  return (
    <section id="planning-recommendations-section" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white space-y-5">
      
      {/* Top Header & Section Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white/15 border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              Planning & Activity Intelligence
            </h2>
            <p className="text-xs text-white/60">
              Actionable lifestyle guidance synthesized from real atmospheric curves
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 text-xs backdrop-blur-md">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Activities ({activities.filter(a => a.score >= 60).length} optimal)
          </button>
          <button
            onClick={() => setActiveTab('outfit')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'outfit'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            Outfit Advisor
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            Health & Commute
          </button>
        </div>
      </div>

      {/* 1. OUTDOOR ACTIVITIES TAB */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <p className="text-xs text-white/70">
            Real-time outdoor activity suitability calculated against temperature, gusts, UV index, and precipitation curves.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all flex flex-col justify-between space-y-3.5 shadow-md"
              >
                {/* Title & Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/15 border border-white/20">
                      {getActivityIcon(act.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{act.title}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-white/70">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span>{act.bestWindow}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                    act.score >= 80 ? 'text-emerald-200 bg-emerald-500/20 border-emerald-400/30' :
                    act.score >= 50 ? 'text-amber-200 bg-amber-500/20 border-amber-400/30' :
                    'text-rose-200 bg-rose-500/20 border-rose-400/30'
                  }`}>
                    {act.rating} ({act.score}%)
                  </span>
                </div>

                {/* Rationale description */}
                <p className="text-xs text-white/80 leading-relaxed">
                  {act.rationale}
                </p>

                {/* Practical tips */}
                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  {act.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-white/70">
                      <CheckCircle2 className="w-3 h-3 text-teal-300 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. OUTFIT ADVISOR TAB */}
      {activeTab === 'outfit' && (
        <div className="space-y-5">
          
          {/* Executive Outfit Alert Banner */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-teal-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Dressing Strategy
                </span>
              </div>
              <p className="text-base font-semibold text-white">{outfit.summary}</p>
              <p className="text-xs text-white/70">{outfit.thermalAdvice}</p>
            </div>

            {/* Quick alert badges */}
            <div className="flex items-center gap-2.5 shrink-0">
              {outfit.umbrellaNeeded && (
                <span className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-blue-500/25 text-blue-200 border border-blue-400/30 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                  <Umbrella className="w-4 h-4" />
                  Umbrella Required
                </span>
              )}
              {outfit.sunProtectionNeeded && (
                <span className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-amber-500/25 text-amber-200 border border-amber-400/30 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                  <Sun className="w-4 h-4" />
                  Sunscreen Recommended
                </span>
              )}
            </div>
          </div>

          {/* Detailed Wardrobe Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Clothing Layers */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-md">
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest block">
                Recommended Layers
              </span>
              <div className="space-y-2">
                {outfit.layers.map((layer, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-white">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold text-teal-200 shrink-0 mt-0.5 border border-white/20">
                      {idx + 1}
                    </span>
                    <span>{layer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footwear */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-md">
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest block">
                Footwear Selection
              </span>
              <div className="flex items-start gap-2.5 text-xs text-white">
                <div className="p-1.5 rounded-xl bg-white/15 border border-white/20 shrink-0">
                  <Footprints className="w-4 h-4 text-emerald-200" />
                </div>
                <span className="mt-0.5">{outfit.footwear}</span>
              </div>
            </div>

            {/* Accessories & Gear */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-md">
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest block">
                Accessories & Essentials
              </span>
              <div className="space-y-2">
                {outfit.accessories.map((acc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. HEALTH, COMFORT & COMMUTE TAB */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Thermal Comfort Sensation */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Thermal Sensation
                </span>
                <HeartPulse className="w-4 h-4 text-rose-300" />
              </div>
              <p className="text-lg font-bold text-white font-display">
                {health.thermalComfort.label}
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                {health.thermalComfort.description}
              </p>
            </div>

            {/* UV Exposure Limit */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  UV Safe Exposure
                </span>
                <Sun className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-lg font-bold text-amber-200 font-display">
                ~{health.uvRisk.maxExposureMinutes} mins max
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                {health.uvRisk.advice}
              </p>
            </div>

            {/* Barometric & Migraine Risk */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Barometer & Headaches
                </span>
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
              </div>
              <p className="text-lg font-bold text-white font-display">
                {health.pressureTrend.migraineRisk} Migraine Risk
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Barometer is {health.pressureTrend.trend.toLowerCase()} at {health.pressureTrend.pressure} hPa.
              </p>
            </div>

            {/* Commute Road Safety */}
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Commute Safety
                </span>
                <Car className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-lg font-bold text-teal-200 font-display">
                {health.commuteSafety.status} ({health.commuteSafety.score}/100)
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                {health.commuteSafety.details}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
