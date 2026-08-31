import React from 'react';
import { 
  Sun, 
  Moon, 
  SunMedium, 
  MoonStar, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudRainWind, 
  CloudSnow, 
  Snowflake, 
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = true, className = 'w-8 h-8' }) => {
  const condition = getWeatherCondition(code, isDay);

  switch (condition.icon) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-[spin_30s_linear_infinite]`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'SunMedium':
      return <SunMedium className={`${className} text-amber-400`} />;
    case 'MoonStar':
      return <MoonStar className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-400`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-teal-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-blue-300`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-400`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-cyan-200`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-cyan-200`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-purple-400`} />;
    default:
      return <Sparkles className={`${className} text-sky-400`} />;
  }
};
