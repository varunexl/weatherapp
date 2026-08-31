import React, { useState } from 'react';
import { Clock, CloudRain, Wind, Thermometer } from 'lucide-react';
import { HourlyForecastPoint, TempUnit, WindUnit } from '../types';
import { convertTemp, convertWind, formatWindDirection } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HourlyForecastProps {
  hourly: HourlyForecastPoint[];
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  tempUnit,
  windUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'wind'>('temp');
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windUnitLabel = windUnit === 'kmh' ? 'km/h' : windUnit === 'mph' ? 'mph' : 'm/s';

  const chartData = hourly.map((point) => ({
    time: point.formattedTime,
    temp: convertTemp(point.temperature, tempUnit),
    feelsLike: convertTemp(point.apparentTemperature, tempUnit),
    rainProb: point.precipitationProbability,
    precipitation: point.precipitation,
    wind: convertWind(point.windSpeed, windUnit),
    weatherCode: point.weatherCode,
    isDay: point.isDay,
  }));

  return (
    <section id="hourly-forecast-section" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white space-y-5">
      
      {/* Header with Title & Metrics Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white/15 border border-white/20">
            <Clock className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              24-Hour Forecast
            </h2>
            <p className="text-xs text-white/60">
              Hourly high-resolution Open-Meteo trajectory
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 text-xs backdrop-blur-md">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'temp'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'rain'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Precipitation
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'wind'
                ? 'bg-white/30 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind
          </button>
        </div>
      </div>

      {/* Responsive Visual Chart */}
      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                formatter={(value: any) => [`${value}${tempUnitSymbol}`, 'Temperature']}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#ffffff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          ) : activeTab === 'rain' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                formatter={(value: any) => [`${value}%`, 'Precipitation Chance']}
              />
              <Area
                type="monotone"
                dataKey="rainProb"
                stroke="#60a5fa"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rainGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                formatter={(value: any) => [`${value} ${windUnitLabel}`, 'Wind Speed']}
              />
              <Area
                type="monotone"
                dataKey="wind"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Horizontal Scrollable Hourly Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hourly.map((point, index) => {
          const pointTemp = convertTemp(point.temperature, tempUnit);
          const pointWind = convertWind(point.windSpeed, windUnit);

          return (
            <div
              key={`${point.time}-${index}`}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[5.5rem] border shrink-0 transition-all backdrop-blur-md ${
                index === 0
                  ? 'bg-white/25 border-white/40 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/90'
              }`}
            >
              <span className={`text-xs font-semibold ${index === 0 ? 'text-teal-200' : 'text-white/70'}`}>
                {point.formattedTime}
              </span>

              <div className="my-2.5">
                <WeatherIcon code={point.weatherCode} isDay={point.isDay} className="w-7 h-7" />
              </div>

              <span className="text-base font-bold text-white font-display">
                {pointTemp}{tempUnitSymbol}
              </span>

              {/* Rain chance pill */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-200">
                <CloudRain className="w-3 h-3" />
                <span>{point.precipitationProbability}%</span>
              </div>

              {/* Wind mini indicator */}
              <span className="text-[10px] text-white/60 mt-1">
                {pointWind} {windUnitLabel}
              </span>
            </div>
          );
        })}
      </div>

    </section>
  );
};
