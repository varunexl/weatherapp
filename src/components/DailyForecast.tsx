import React, { useState } from 'react';
import { 
  Calendar, 
  CloudRain, 
  ChevronRight, 
  Sunrise, 
  Sunset,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { DailyForecastPoint, TempUnit, WindUnit } from '../types';
import { getWeatherCondition, convertTemp, convertWind, formatWindDirection } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastPoint[];
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
  windUnit,
}) => {
  const [selectedDay, setSelectedDay] = useState<DailyForecastPoint | null>(null);

  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windUnitLabel = windUnit === 'kmh' ? 'km/h' : windUnit === 'mph' ? 'mph' : 'm/s';

  // Compute 7-day absolute min and max for proportional temperature bars
  const allMins = daily.map((d) => d.temperatureMin);
  const allMaxs = daily.map((d) => d.temperatureMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const rangeSpan = Math.max(1, globalMax - globalMin);

  return (
    <section id="daily-forecast-section" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white space-y-5">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white/15 border border-white/20">
            <Calendar className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              7-Day Extended Forecast
            </h2>
            <p className="text-xs text-white/60">
              Long-range temperature trajectories & precipitation dynamics
            </p>
          </div>
        </div>
        <span className="text-xs text-white/60 font-mono hidden sm:inline">
          Click any day for deep breakdown
        </span>
      </div>

      {/* 7-Day List View with Proportional Temperature Bars */}
      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode, true);
          const minT = convertTemp(day.temperatureMin, tempUnit);
          const maxT = convertTemp(day.temperatureMax, tempUnit);
          const rainProb = day.precipitationProbabilityMax;

          // Bar offset calculation
          const leftPercent = ((day.temperatureMin - globalMin) / rangeSpan) * 100;
          const widthPercent = Math.max(8, ((day.temperatureMax - day.temperatureMin) / rangeSpan) * 100);

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 group backdrop-blur-md ${
                idx === 0
                  ? 'bg-white/20 border-white/35 hover:bg-white/25 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 border-white/15'
              }`}
            >
              {/* Day Name & Date */}
              <div className="w-24 sm:w-28 shrink-0">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {day.dayName}
                  {idx === 0 && (
                    <span className="w-2 h-2 rounded-full bg-teal-300 inline-block shadow-sm" />
                  )}
                </p>
                <p className="text-[11px] text-white/60 font-mono">
                  {day.formattedDate}
                </p>
              </div>

              {/* Condition Icon & Label */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <WeatherIcon code={day.weatherCode} className="w-6 h-6 shrink-0 text-teal-200" />
                <div className="hidden md:block truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {condition.description}
                  </p>
                  {day.precipitationSum > 0 && (
                    <p className="text-[10px] text-white/60">
                      {day.precipitationSum.toFixed(1)} mm rainfall
                    </p>
                  )}
                </div>
              </div>

              {/* Rain Probability Pill */}
              <div className="w-16 sm:w-20 shrink-0 text-right">
                {rainProb > 0 ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${
                    rainProb > 50
                      ? 'bg-blue-500/25 text-blue-200 border-blue-400/30'
                      : 'bg-white/15 text-sky-200 border-white/20'
                  }`}>
                    <CloudRain className="w-3 h-3" />
                    {rainProb}%
                  </span>
                ) : (
                  <span className="text-[11px] text-white/60 font-mono">0%</span>
                )}
              </div>

              {/* Visual Temperature Range Bar */}
              <div className="flex items-center gap-3 w-44 sm:w-56 shrink-0">
                <span className="text-xs font-semibold text-white/70 w-8 text-right font-display">
                  {minT}°
                </span>

                <div className="flex-1 h-2.5 bg-black/20 rounded-full relative overflow-hidden border border-white/10">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-teal-300 via-amber-300 to-orange-400 opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8 font-display">
                  {maxT}°
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/25 rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white/15 border border-white/20">
                  <WeatherIcon code={selectedDay.weatherCode} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedDay.dayName}, {selectedDay.formattedDate}
                  </h3>
                  <p className="text-xs text-white/70">
                    {getWeatherCondition(selectedDay.weatherCode).description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High / Low summary */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-3xl bg-white/10 border border-white/15 space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs text-orange-300 font-semibold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  Maximum Temp
                </div>
                <p className="text-3xl font-bold text-white font-display">
                  {convertTemp(selectedDay.temperatureMax, tempUnit)}{tempUnitSymbol}
                </p>
                <p className="text-[11px] text-white/60">
                  Apparent: {convertTemp(selectedDay.apparentTemperatureMax, tempUnit)}{tempUnitSymbol}
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-white/10 border border-white/15 space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold">
                  <ArrowDown className="w-3.5 h-3.5" />
                  Minimum Temp
                </div>
                <p className="text-3xl font-bold text-white font-display">
                  {convertTemp(selectedDay.temperatureMin, tempUnit)}{tempUnitSymbol}
                </p>
                <p className="text-[11px] text-white/60">
                  Apparent: {convertTemp(selectedDay.apparentTemperatureMin, tempUnit)}{tempUnitSymbol}
                </p>
              </div>
            </div>

            {/* Detail Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Precipitation</span>
                <span className="text-base font-bold text-white">
                  {selectedDay.precipitationSum} mm
                </span>
                <span className="text-[11px] text-sky-200 block">
                  {selectedDay.precipitationProbabilityMax}% max prob
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Peak Wind</span>
                <span className="text-base font-bold text-white">
                  {convertWind(selectedDay.windSpeedMax, windUnit)} {windUnitLabel}
                </span>
                <span className="text-[11px] text-teal-300 block truncate">
                  {formatWindDirection(selectedDay.windDirectionDominant)} (Gusts {convertWind(selectedDay.windGustsMax, windUnit)})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Peak UV Index</span>
                <span className="text-base font-bold text-amber-300">
                  {selectedDay.uvIndexMax.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/60 block">
                  {selectedDay.uvIndexMax >= 6 ? 'High risk' : 'Safe/Moderate'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Sunrise</span>
                <span className="text-sm font-bold text-amber-200 flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5" />
                  {selectedDay.sunrise}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Sunset</span>
                <span className="text-sm font-bold text-indigo-200 flex items-center gap-1">
                  <Sunset className="w-3.5 h-3.5" />
                  {selectedDay.sunset}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <span className="text-white/60 block mb-1">Rain Duration</span>
                <span className="text-sm font-bold text-white">
                  {selectedDay.precipitationHours} hrs
                </span>
              </div>

            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDay(null)}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full border border-white/20 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
