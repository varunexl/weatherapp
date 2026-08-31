import React from 'react';
import { 
  Droplets, 
  Wind, 
  Sun, 
  Compass, 
  Eye, 
  Gauge, 
  CloudRain, 
  ArrowUp, 
  ArrowDown, 
  Sunrise, 
  Sunset, 
  Cloud, 
  Activity,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { WeatherData, TempUnit, WindUnit } from '../types';
import { getWeatherCondition, formatWindDirection, convertTemp, convertWind } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  tempUnit,
  windUnit,
}) => {
  const { current, daily, airQuality, location } = weather;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  const displayTemp = convertTemp(current.temperature, tempUnit);
  const displayApparent = convertTemp(current.apparentTemperature, tempUnit);
  const todayDaily = daily[0];
  const maxTemp = todayDaily ? convertTemp(todayDaily.temperatureMax, tempUnit) : displayTemp;
  const minTemp = todayDaily ? convertTemp(todayDaily.temperatureMin, tempUnit) : displayTemp;
  
  const displayWind = convertWind(current.windSpeed, windUnit);
  const displayGusts = convertWind(current.windGusts, windUnit);
  const windUnitLabel = windUnit === 'kmh' ? 'km/h' : windUnit === 'mph' ? 'mph' : 'm/s';
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';

  const windDirLabel = formatWindDirection(current.windDirection);

  // UV index level helper
  const getUVBadge = (uv: number) => {
    if (uv >= 11) return { label: 'Extreme', color: 'text-purple-200 bg-purple-500/20 border-purple-400/30' };
    if (uv >= 8) return { label: 'Very High', color: 'text-rose-200 bg-rose-500/20 border-rose-400/30' };
    if (uv >= 6) return { label: 'High', color: 'text-amber-200 bg-amber-500/20 border-amber-400/30' };
    if (uv >= 3) return { label: 'Moderate', color: 'text-yellow-200 bg-yellow-500/20 border-yellow-400/30' };
    return { label: 'Low', color: 'text-emerald-200 bg-emerald-500/20 border-emerald-400/30' };
  };

  const uvInfo = getUVBadge(current.uvIndex || 0);

  return (
    <section id="current-weather-section" className="space-y-5">
      
      {/* Hero Overview Frosted Glass Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 flex flex-col justify-between shadow-2xl text-white relative overflow-hidden">
        
        {/* Subtle ambient lighting */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Main Temp & Condition */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white backdrop-blur-md shadow-sm">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </span>
              <span className="text-xs text-white/60 font-mono">
                Updated {weather.lastUpdated}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6">
              <div className="flex items-start">
                <span className="text-7xl sm:text-8xl font-thin tracking-tighter text-white font-display">
                  {displayTemp}°
                </span>
                <span className="text-3xl sm:text-4xl font-light text-white/70 mt-3 sm:mt-4 ml-1">
                  {tempUnit === 'celsius' ? 'C' : 'F'}
                </span>
              </div>

              <div className="space-y-1.5 pb-2">
                <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-semibold text-white">
                  <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-7 h-7 text-teal-200" />
                  <span>{condition.description}</span>
                </div>
                <p className="text-sm text-white/80">
                  Feels like <span className="font-bold text-white">{displayApparent}{tempUnitSymbol}</span>
                </p>
              </div>
            </div>

            {/* High / Low & Coordinates */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-white bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm">
                <ArrowUp className="w-3.5 h-3.5 text-orange-300" />
                <span>High: <strong className="font-bold">{maxTemp}{tempUnitSymbol}</strong></span>
                <span className="text-white/30">|</span>
                <ArrowDown className="w-3.5 h-3.5 text-teal-300" />
                <span>Low: <strong className="font-bold">{minTemp}{tempUnitSymbol}</strong></span>
              </div>

              <div className="text-xs text-white/60">
                Elevation: <span className="text-white/90">{weather.elevation}m</span>
              </div>
              <div className="text-xs text-white/60">
                TZ: <span className="text-white/90">{weather.timezone}</span>
              </div>
            </div>
          </div>

          {/* Quick Primary Badges: Rain, Wind, Sun progress */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center shrink-0">
            
            {/* Precipitation status pill */}
            <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <div className="p-2 rounded-2xl bg-white/10">
                <CloudRain className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <p className="text-[11px] text-white/60 uppercase tracking-widest font-semibold">Precipitation</p>
                <p className="text-base font-semibold text-white">
                  {current.precipitation > 0 ? `${current.precipitation} mm` : '0.0 mm'}
                  <span className="text-xs text-white/60 font-normal ml-2">
                    ({todayDaily?.precipitationProbabilityMax || 0}% chance)
                  </span>
                </p>
              </div>
            </div>

            {/* Wind Summary pill */}
            <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <div className="p-2 rounded-2xl bg-white/10">
                <Wind className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <p className="text-[11px] text-white/60 uppercase tracking-widest font-semibold">Wind Speed</p>
                <p className="text-base font-semibold text-white">
                  {displayWind} {windUnitLabel} <span className="text-teal-300 font-bold">{windDirLabel}</span>
                  <span className="text-xs text-white/60 font-normal ml-2">
                    (Gusts {displayGusts})
                  </span>
                </p>
              </div>
            </div>

            {/* Daylight status */}
            {todayDaily && (
              <div className="flex items-center justify-between gap-4 px-5 py-2.5 rounded-3xl bg-white/5 border border-white/10 text-xs text-white/80">
                <div className="flex items-center gap-1.5 text-amber-200">
                  <Sunrise className="w-4 h-4" />
                  <span>Sunrise {todayDaily.sunrise}</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-1.5 text-indigo-200">
                  <Sunset className="w-4 h-4" />
                  <span>Sunset {todayDaily.sunset}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Meteorological Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        
        {/* Humidity */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-300" />
          </div>
          <p className="text-2xl font-bold text-white font-display">{current.relativeHumidity}%</p>
          <p className="text-xs text-white/60">
            Dew point: {convertTemp(current.dewPoint || 10, tempUnit)}{tempUnitSymbol}
          </p>
        </div>

        {/* Wind Speed & Compass */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">Wind Vector</span>
            <div 
              className="w-4 h-4 text-teal-300 transition-transform duration-500" 
              style={{ transform: `rotate(${current.windDirection}deg)` }}
              title={`${current.windDirection}° (${windDirLabel})`}
            >
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-display">
            {displayWind} <span className="text-xs font-normal text-white/60">{windUnitLabel}</span>
          </p>
          <p className="text-xs text-white/60">
            From {windDirLabel} ({current.windDirection}°)
          </p>
        </div>

        {/* UV Index */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">UV Index</span>
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white font-display">
              {current.uvIndex !== undefined ? current.uvIndex.toFixed(1) : '0.0'}
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>
          <p className="text-xs text-white/60">
            Max {todayDaily?.uvIndexMax?.toFixed(1) || 0} today
          </p>
        </div>

        {/* Air Pressure */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-300" />
          </div>
          <p className="text-2xl font-bold text-white font-display">
            {current.pressureMsl} <span className="text-xs font-normal text-white/60">hPa</span>
          </p>
          <p className="text-xs text-white/60 truncate">
            {current.pressureMsl >= 1013 ? 'High (Stable)' : 'Low (Precip)'}
          </p>
        </div>

        {/* Visibility */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">Visibility</span>
            <Eye className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="text-2xl font-bold text-white font-display">
            {current.visibility !== undefined ? `${current.visibility} km` : '10+ km'}
          </p>
          <p className="text-xs text-white/60">
            Cloud cover: {current.cloudCover}%
          </p>
        </div>

        {/* Air Quality */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-lg space-y-1 text-white">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs uppercase tracking-widest font-semibold">Air Quality</span>
            <Activity className="w-4 h-4 text-teal-300" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white font-display">
              {airQuality?.usAqi !== undefined ? airQuality.usAqi : 'Good'}
            </p>
            {airQuality?.category && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${
                airQuality.category === 'Good' ? 'text-emerald-200 bg-emerald-500/20 border-emerald-400/30' :
                airQuality.category === 'Moderate' ? 'text-amber-200 bg-amber-500/20 border-amber-400/30' :
                'text-rose-200 bg-rose-500/20 border-rose-400/30'
              }`}>
                {airQuality.category}
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 truncate">
            {airQuality?.pm25 ? `PM2.5: ${airQuality.pm25.toFixed(1)} µg/m³` : 'Standard pure air'}
          </p>
        </div>

      </div>

    </section>
  );
};
