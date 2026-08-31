import { WeatherCondition } from '../types';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        code,
        description: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'Sun' : 'Moon',
        theme: 'clear',
        bgGradient: isDay 
          ? 'from-amber-500/20 via-sky-500/10 to-slate-900' 
          : 'from-indigo-900/30 via-slate-900 to-slate-950',
        accentColor: isDay ? 'text-amber-400' : 'text-indigo-300',
        isDay,
      };
    case 1:
      return {
        code,
        description: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        theme: 'clear',
        bgGradient: isDay
          ? 'from-amber-500/15 via-sky-600/10 to-slate-900'
          : 'from-indigo-900/25 via-slate-900 to-slate-950',
        accentColor: isDay ? 'text-amber-300' : 'text-indigo-300',
        isDay,
      };
    case 2:
      return {
        code,
        description: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        theme: 'cloudy',
        bgGradient: 'from-sky-700/20 via-slate-800/40 to-slate-900',
        accentColor: 'text-sky-300',
        isDay,
      };
    case 3:
      return {
        code,
        description: 'Overcast',
        icon: 'Cloud',
        theme: 'cloudy',
        bgGradient: 'from-slate-700/30 via-slate-800 to-slate-950',
        accentColor: 'text-slate-300',
        isDay,
      };
    case 45:
      return {
        code,
        description: 'Foggy',
        icon: 'CloudFog',
        theme: 'fog',
        bgGradient: 'from-slate-600/30 via-slate-800 to-slate-950',
        accentColor: 'text-teal-300',
        isDay,
      };
    case 48:
      return {
        code,
        description: 'Depositing Rime Fog',
        icon: 'CloudFog',
        theme: 'fog',
        bgGradient: 'from-slate-600/30 via-slate-800 to-slate-950',
        accentColor: 'text-teal-300',
        isDay,
      };
    case 51:
      return {
        code,
        description: 'Light Drizzle',
        icon: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-blue-600/20 via-slate-800 to-slate-950',
        accentColor: 'text-blue-300',
        isDay,
      };
    case 53:
      return {
        code,
        description: 'Moderate Drizzle',
        icon: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-blue-700/25 via-slate-800 to-slate-950',
        accentColor: 'text-blue-300',
        isDay,
      };
    case 55:
      return {
        code,
        description: 'Dense Drizzle',
        icon: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-blue-800/30 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 56:
    case 57:
      return {
        code,
        description: 'Freezing Drizzle',
        icon: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-cyan-800/30 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-300',
        isDay,
      };
    case 61:
      return {
        code,
        description: 'Slight Rain',
        icon: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-blue-700/25 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 63:
      return {
        code,
        description: 'Moderate Rain',
        icon: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-blue-800/35 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 65:
      return {
        code,
        description: 'Heavy Rain',
        icon: 'CloudRainWind',
        theme: 'rain',
        bgGradient: 'from-blue-900/40 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 66:
    case 67:
      return {
        code,
        description: 'Freezing Rain',
        icon: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-cyan-900/30 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-300',
        isDay,
      };
    case 71:
      return {
        code,
        description: 'Slight Snow Fall',
        icon: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-cyan-700/25 via-slate-800 to-slate-950',
        accentColor: 'text-cyan-200',
        isDay,
      };
    case 73:
      return {
        code,
        description: 'Moderate Snow Fall',
        icon: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-cyan-800/35 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-200',
        isDay,
      };
    case 75:
      return {
        code,
        description: 'Heavy Snow Fall',
        icon: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-cyan-900/45 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-100',
        isDay,
      };
    case 77:
      return {
        code,
        description: 'Snow Grains',
        icon: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-cyan-800/30 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-200',
        isDay,
      };
    case 80:
      return {
        code,
        description: 'Slight Showers',
        icon: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-blue-700/25 via-slate-900 to-slate-950',
        accentColor: 'text-blue-300',
        isDay,
      };
    case 81:
      return {
        code,
        description: 'Moderate Showers',
        icon: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-blue-800/35 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 82:
      return {
        code,
        description: 'Violent Showers',
        icon: 'CloudRainWind',
        theme: 'rain',
        bgGradient: 'from-blue-900/50 via-slate-900 to-slate-950',
        accentColor: 'text-blue-400',
        isDay,
      };
    case 85:
    case 86:
      return {
        code,
        description: 'Snow Showers',
        icon: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-cyan-900/35 via-slate-900 to-slate-950',
        accentColor: 'text-cyan-200',
        isDay,
      };
    case 95:
      return {
        code,
        description: 'Thunderstorm',
        icon: 'CloudLightning',
        theme: 'thunder',
        bgGradient: 'from-purple-900/40 via-slate-900 to-slate-950',
        accentColor: 'text-purple-300',
        isDay,
      };
    case 96:
    case 99:
      return {
        code,
        description: 'Thunderstorm with Hail',
        icon: 'CloudLightning',
        theme: 'thunder',
        bgGradient: 'from-amber-900/30 via-purple-950 to-slate-950',
        accentColor: 'text-amber-400',
        isDay,
      };
    default:
      return {
        code,
        description: 'Partly Cloudy',
        icon: 'Cloud',
        theme: 'cloudy',
        bgGradient: 'from-slate-800 via-slate-900 to-slate-950',
        accentColor: 'text-slate-300',
        isDay,
      };
  }
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertWind(kmh: number, unit: 'kmh' | 'mph' | 'ms'): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371 * 10) / 10;
  }
  if (unit === 'ms') {
    return Math.round((kmh / 3.6) * 10) / 10;
  }
  return Math.round(kmh * 10) / 10;
}
