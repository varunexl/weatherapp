import { LocationSearchResult, WeatherData, HourlyForecastPoint, DailyForecastPoint, AirQualityData, AIWeatherInsights } from '../types';

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();
    return (data.results || []) as LocationSearchResult[];
  } catch (err) {
    console.error('Error searching location:', err);
    return [];
  }
}

export async function getReverseLocation(latitude: number, longitude: number): Promise<LocationSearchResult> {
  // Best effort reverse geocoding via Open-Meteo or fallback
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
    }
  } catch {
    // Ignore and fallback
  }

  return {
    id: Date.now(),
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
  };
}

export async function fetchWeatherData(location: LocationSearchResult): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.allSettled([
    fetch(weatherUrl),
    fetch(airQualityUrl),
  ]);

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
    throw new Error('Failed to retrieve forecast data from Open-Meteo');
  }

  const rawWeather = await weatherRes.value.json();

  let airQuality: AirQualityData | undefined;
  if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
    try {
      const rawAqi = await aqiRes.value.json();
      if (rawAqi.current) {
        const usAqi = rawAqi.current.us_aqi;
        let category: AirQualityData['category'] = 'Good';
        if (usAqi > 300) category = 'Hazardous';
        else if (usAqi > 200) category = 'Very Unhealthy';
        else if (usAqi > 150) category = 'Unhealthy';
        else if (usAqi > 100) category = 'Unhealthy for Sensitive';
        else if (usAqi > 50) category = 'Moderate';

        airQuality = {
          usAqi: rawAqi.current.us_aqi,
          europeanAqi: rawAqi.current.european_aqi,
          pm25: rawAqi.current.pm2_5,
          pm10: rawAqi.current.pm10,
          ozone: rawAqi.current.ozone,
          nitrogenDioxide: rawAqi.current.nitrogen_dioxide,
          category,
        };
      }
    } catch (e) {
      console.warn('AQI parse skipped:', e);
    }
  }

  // Format hourly data (take next 24-48 hours starting from current time index)
  const hourlyTimes = rawWeather.hourly.time as string[];
  const currentTimeIso = rawWeather.current.time;
  
  // Find current hour index or default to 0
  let currentIndex = hourlyTimes.findIndex(t => t.startsWith(currentTimeIso.substring(0, 13)));
  if (currentIndex === -1) currentIndex = 0;

  // Extract next 24 hours
  const hourly: HourlyForecastPoint[] = [];
  for (let i = currentIndex; i < Math.min(hourlyTimes.length, currentIndex + 24); i++) {
    const rawTime = hourlyTimes[i];
    const dateObj = new Date(rawTime);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    hourly.push({
      time: rawTime,
      formattedTime: i === currentIndex ? 'Now' : formattedTime,
      temperature: rawWeather.hourly.temperature_2m[i],
      apparentTemperature: rawWeather.hourly.apparent_temperature[i],
      relativeHumidity: rawWeather.hourly.relative_humidity_2m[i],
      precipitationProbability: rawWeather.hourly.precipitation_probability ? rawWeather.hourly.precipitation_probability[i] : 0,
      precipitation: rawWeather.hourly.precipitation[i] || 0,
      weatherCode: rawWeather.hourly.weather_code[i],
      windSpeed: rawWeather.hourly.wind_speed_10m[i],
      windDirection: rawWeather.hourly.wind_direction_10m[i],
      uvIndex: rawWeather.hourly.uv_index ? rawWeather.hourly.uv_index[i] : 0,
      isDay: rawWeather.hourly.is_day ? Boolean(rawWeather.hourly.is_day[i]) : true,
    });
  }

  // Format daily 7-day data
  const dailyDates = rawWeather.daily.time as string[];
  const daily: DailyForecastPoint[] = [];

  for (let i = 0; i < Math.min(dailyDates.length, 7); i++) {
    const dStr = dailyDates[i];
    const dObj = new Date(dStr + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    daily.push({
      date: dStr,
      dayName,
      formattedDate,
      weatherCode: rawWeather.daily.weather_code[i],
      temperatureMax: rawWeather.daily.temperature_2m_max[i],
      temperatureMin: rawWeather.daily.temperature_2m_min[i],
      apparentTemperatureMax: rawWeather.daily.apparent_temperature_max[i],
      apparentTemperatureMin: rawWeather.daily.apparent_temperature_min[i],
      sunrise: rawWeather.daily.sunrise[i] ? new Date(rawWeather.daily.sunrise[i]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '--',
      sunset: rawWeather.daily.sunset[i] ? new Date(rawWeather.daily.sunset[i]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '--',
      uvIndexMax: rawWeather.daily.uv_index_max ? rawWeather.daily.uv_index_max[i] : 0,
      precipitationSum: rawWeather.daily.precipitation_sum[i] || 0,
      precipitationHours: rawWeather.daily.precipitation_hours[i] || 0,
      precipitationProbabilityMax: rawWeather.daily.precipitation_probability_max ? rawWeather.daily.precipitation_probability_max[i] : 0,
      windSpeedMax: rawWeather.daily.wind_speed_10m_max[i],
      windGustsMax: rawWeather.daily.wind_gusts_10m_max[i],
      windDirectionDominant: rawWeather.daily.wind_direction_10m_dominant[i],
    });
  }

  // Get current UV from hourly or daily
  const currentUV = hourly[0]?.uvIndex ?? (rawWeather.daily.uv_index_max?.[0] || 0);
  const currentDewPoint = rawWeather.hourly.dew_point_2m?.[currentIndex] ?? 10;
  const currentVisibility = rawWeather.hourly.visibility?.[currentIndex] ? Math.round(rawWeather.hourly.visibility[currentIndex] / 1000) : 10;

  return {
    location,
    current: {
      time: rawWeather.current.time,
      temperature: rawWeather.current.temperature_2m,
      apparentTemperature: rawWeather.current.apparent_temperature,
      relativeHumidity: rawWeather.current.relative_humidity_2m,
      isDay: Boolean(rawWeather.current.is_day),
      precipitation: rawWeather.current.precipitation,
      rain: rawWeather.current.rain,
      showers: rawWeather.current.showers,
      snowfall: rawWeather.current.snowfall,
      weatherCode: rawWeather.current.weather_code,
      cloudCover: rawWeather.current.cloud_cover,
      pressureMsl: Math.round(rawWeather.current.pressure_msl),
      surfacePressure: Math.round(rawWeather.current.surface_pressure),
      windSpeed: rawWeather.current.wind_speed_10m,
      windDirection: rawWeather.current.wind_direction_10m,
      windGusts: rawWeather.current.wind_gusts_10m,
      uvIndex: currentUV,
      dewPoint: currentDewPoint,
      visibility: currentVisibility,
    },
    hourly,
    daily,
    airQuality,
    timezone: rawWeather.timezone,
    elevation: rawWeather.elevation,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function fetchAIWeatherInsights(
  weatherData: WeatherData,
  activityFocus?: string
): Promise<AIWeatherInsights> {
  try {
    const summaryDaily = weatherData.daily
      .slice(0, 3)
      .map(d => `${d.dayName}: High ${d.temperatureMax}°C / Low ${d.temperatureMin}°C, ${d.precipitationProbabilityMax}% rain prob`)
      .join('; ');

    const res = await fetch('/api/weather-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: weatherData.location.name,
        country: weatherData.location.country,
        currentWeather: {
          temperature: weatherData.current.temperature,
          apparentTemperature: weatherData.current.apparentTemperature,
          humidity: weatherData.current.relativeHumidity,
          windSpeed: `${weatherData.current.windSpeed} km/h`,
          uvIndex: weatherData.current.uvIndex,
          precipitation: weatherData.current.precipitation,
          precipitationProbability: weatherData.hourly[0]?.precipitationProbability || 0,
          pressure: weatherData.current.pressureMsl,
          weatherCode: weatherData.current.weatherCode,
          unit: '°C',
        },
        forecastSummary: summaryDaily,
        activityFocus: activityFocus || 'General outdoor planning and daily commute',
      }),
    });

    if (!res.ok) {
      throw new Error('AI service response error');
    }

    return await res.json();
  } catch (e) {
    console.warn('AI Insights fallback triggered:', e);
    // Fallback intelligent heuristic insight
    const t = weatherData.current.temperature;
    const isRainy = weatherData.current.weatherCode >= 50 && weatherData.current.weatherCode <= 82;
    const isCold = t < 10;
    const isHot = t > 28;

    return {
      summary: `Expect ${isRainy ? 'wet conditions' : isHot ? 'warm sunshine' : isCold ? 'crisp cool weather' : 'mild conditions'} in ${weatherData.location.name} with temperatures hovering around ${t}°C and feels like ${weatherData.current.apparentTemperature}°C.`,
      activityAdvice: isRainy
        ? 'Indoor activities or gym sessions are ideal. If going outside, rain-protected paths and early mornings offer lower rain likelihood.'
        : isHot
        ? 'Morning and late evening (after 6 PM) are peak windows for running and cycling to avoid midday solar radiation.'
        : 'Favorable conditions throughout the daylight hours. Great time for running, walking, or exploring outdoors.',
      outfitAdvice: isCold
        ? 'Thermal base layer, warm sweater or insulated jacket, wind protection, and warm shoes.'
        : isHot
        ? 'Breathable activewear, sunglasses, SPF 50 sunscreen, and a hydration bottle.'
        : 'Casual layers such as a light windbreaker or hoodie that can be adjusted as temperatures shift.',
      keyAlert: isRainy
        ? 'Carry a sturdy umbrella and watch for slippery pavement.'
        : weatherData.current.windSpeed > 35
        ? 'Breezy winds recorded; secure loose outdoor objects.'
        : (weatherData.current.uvIndex || 0) >= 6
        ? 'High UV Index: limit direct sun exposure between 11 AM - 3 PM.'
        : 'Mild, stable meteorological conditions prevailing.',
      idealOutdoorWindow: '08:00 AM – 11:30 AM',
      source: 'heuristic',
    };
  }
}
