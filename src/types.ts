export interface LocationSearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph' | 'ms';

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  theme: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
  bgGradient: string;
  accentColor: string;
  isDay?: boolean;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex?: number;
  dewPoint?: number;
  visibility?: number;
}

export interface HourlyForecastPoint {
  time: string;
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastPoint {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationHours: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface AirQualityData {
  usAqi?: number;
  europeanAqi?: number;
  pm25?: number;
  pm10?: number;
  ozone?: number;
  nitrogenDioxide?: number;
  category?: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export interface WeatherData {
  location: LocationSearchResult;
  current: CurrentWeatherData;
  hourly: HourlyForecastPoint[];
  daily: DailyForecastPoint[];
  airQuality?: AirQualityData;
  timezone: string;
  elevation: number;
  lastUpdated: string;
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  icon: string;
  score: number; // 0 to 100
  rating: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  color: string;
  bestWindow: string;
  rationale: string;
  tips: string[];
}

export interface OutfitRecommendation {
  summary: string;
  layers: string[];
  footwear: string;
  accessories: string[];
  umbrellaNeeded: boolean;
  sunProtectionNeeded: boolean;
  thermalAdvice: string;
}

export interface HealthComfortMetrics {
  thermalComfort: {
    label: string;
    description: string;
    status: 'Comfortable' | 'Warm' | 'Hot' | 'Chilly' | 'Cold' | 'Extreme';
  };
  uvRisk: {
    index: number;
    level: string;
    maxExposureMinutes: number;
    advice: string;
  };
  humidityComfort: {
    percentage: number;
    dewPoint: number;
    level: 'Dry' | 'Pleasant' | 'Humid' | 'Oppressive';
  };
  pressureTrend: {
    pressure: number;
    trend: 'Rising' | 'Steady' | 'Falling';
    migraineRisk: 'Low' | 'Moderate' | 'Elevated';
  };
  commuteSafety: {
    status: 'Clear' | 'Wet Roads' | 'Low Visibility' | 'High Wind Warning' | 'Hazardous';
    details: string;
    score: number; // 0-100
  };
}

export interface AIWeatherInsights {
  summary: string;
  activityAdvice: string;
  outfitAdvice: string;
  keyAlert: string;
  idealOutdoorWindow?: string;
  source?: 'gemini' | 'heuristic' | 'gemini-raw';
  loading?: boolean;
}
