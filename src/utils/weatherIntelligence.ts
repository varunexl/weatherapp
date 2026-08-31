import { WeatherData, ActivityRecommendation, OutfitRecommendation, HealthComfortMetrics } from '../types';

export function computeActivityRecommendations(weather: WeatherData): ActivityRecommendation[] {
  const { current, hourly } = weather;
  const temp = current.temperature;
  const wind = current.windSpeed;
  const rainProb = hourly[0]?.precipitationProbability || (current.precipitation > 0 ? 80 : 10);
  const uv = current.uvIndex || 0;
  const isNight = !current.isDay;
  const code = current.weatherCode;
  const isRaining = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStorming = code >= 95;
  const isSnowing = code >= 71 && code <= 77;

  // Helper to find the best window in the next 12 hours
  const findBestWindowFor = (criteria: (h: typeof hourly[0]) => number): string => {
    if (!hourly || hourly.length === 0) return 'Morning (08:00 - 11:00 AM)';
    
    const daytimeHourly = hourly.slice(0, 16);
    let bestScore = -1;
    let bestIdx = 0;

    for (let i = 0; i < daytimeHourly.length; i++) {
      const score = criteria(daytimeHourly[i]);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    const startH = daytimeHourly[bestIdx];
    const endIdx = Math.min(daytimeHourly.length - 1, bestIdx + 2);
    const endH = daytimeHourly[endIdx];

    return `${startH.formattedTime} – ${endH.formattedTime}`;
  };

  // 1. Running & Jogging
  let runningScore = 90;
  if (temp < 5) runningScore -= 25;
  else if (temp < 10) runningScore -= 10;
  else if (temp > 28) runningScore -= 35;
  else if (temp > 23) runningScore -= 15;

  if (wind > 35) runningScore -= 30;
  else if (wind > 20) runningScore -= 15;

  if (isRaining) runningScore -= 45;
  else if (rainProb > 40) runningScore -= 20;

  if (isStorming) runningScore = 5;
  if (isSnowing) runningScore -= 30;
  runningScore = Math.max(5, Math.min(100, runningScore));

  const runningRating = runningScore >= 80 ? 'Optimal' : runningScore >= 60 ? 'Good' : runningScore >= 40 ? 'Fair' : 'Poor';
  const runningWindow = findBestWindowFor(h => {
    let s = 100;
    if (h.temperature < 8 || h.temperature > 24) s -= 30;
    if (h.precipitationProbability > 20) s -= 40;
    if (h.windSpeed > 20) s -= 20;
    if (!h.isDay) s -= 30;
    return s;
  });

  // 2. Cycling & Commuting
  let cyclingScore = 88;
  if (wind > 35) cyclingScore -= 40;
  else if (wind > 22) cyclingScore -= 20;

  if (isRaining) cyclingScore -= 50;
  else if (rainProb > 30) cyclingScore -= 25;

  if (temp < 4 || temp > 32) cyclingScore -= 30;
  if (isStorming) cyclingScore = 0;
  if (isSnowing) cyclingScore = 15;
  cyclingScore = Math.max(5, Math.min(100, cyclingScore));
  const cyclingRating = cyclingScore >= 80 ? 'Optimal' : cyclingScore >= 60 ? 'Good' : cyclingScore >= 40 ? 'Fair' : 'Poor';
  const cyclingWindow = findBestWindowFor(h => 100 - h.windSpeed - (h.precipitationProbability * 0.8) + (h.isDay ? 20 : 0));

  // 3. Hiking & Nature Trails
  let hikingScore = 85;
  if (isRaining || isStorming) hikingScore -= 60;
  else if (rainProb > 40) hikingScore -= 30;

  if (temp < 2 || temp > 30) hikingScore -= 30;
  if (wind > 40) hikingScore -= 35;
  hikingScore = Math.max(5, Math.min(100, hikingScore));
  const hikingRating = hikingScore >= 80 ? 'Optimal' : hikingScore >= 60 ? 'Good' : hikingScore >= 40 ? 'Fair' : 'Poor';
  const hikingWindow = findBestWindowFor(h => (h.isDay ? 50 : 0) + (100 - h.precipitationProbability) - (h.temperature > 28 ? 30 : 0));

  // 4. Outdoor Dining & Patio
  let diningScore = 95;
  if (temp < 16 || temp > 30) diningScore -= 40;
  else if (temp < 19 || temp > 27) diningScore -= 15;
  if (wind > 20) diningScore -= 35;
  if (isRaining || rainProb > 25) diningScore -= 50;
  diningScore = Math.max(5, Math.min(100, diningScore));
  const diningRating = diningScore >= 80 ? 'Optimal' : diningScore >= 60 ? 'Good' : diningScore >= 40 ? 'Fair' : 'Poor';
  const diningWindow = findBestWindowFor(h => {
    let s = 50;
    if (h.temperature >= 18 && h.temperature <= 26) s += 40;
    if (h.precipitationProbability < 15) s += 30;
    if (h.windSpeed < 15) s += 20;
    return s;
  });

  // 5. Photography & Golden Hour
  let photoScore = 80;
  if (current.cloudCover >= 20 && current.cloudCover <= 70) photoScore += 15; // nice dramatic clouds
  else if (current.cloudCover > 90) photoScore -= 20;
  if (isRaining) photoScore -= 35;
  if (isStorming) photoScore -= 50;
  photoScore = Math.max(10, Math.min(100, photoScore));
  const photoRating = photoScore >= 80 ? 'Optimal' : photoScore >= 60 ? 'Good' : photoScore >= 40 ? 'Fair' : 'Poor';

  // 6. Stargazing (nighttime only)
  let starScore = 100 - current.cloudCover;
  if (current.isDay) starScore = 20;
  if (isRaining || isSnowing) starScore = 0;
  starScore = Math.max(5, Math.min(100, starScore));
  const starRating = starScore >= 75 ? 'Optimal' : starScore >= 50 ? 'Good' : starScore >= 30 ? 'Fair' : 'Poor';

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Optimal': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Good': return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Fair': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return [
    {
      id: 'running',
      title: 'Running & Jogging',
      icon: 'Activity',
      score: runningScore,
      rating: runningRating,
      color: getRatingColor(runningRating),
      bestWindow: runningWindow,
      rationale: runningScore >= 75 
        ? `Crisp ${temp}°C conditions with manageable wind (${wind} km/h). Excellent energy retention.`
        : isRaining 
        ? 'Wet ground and ongoing rain. Consider indoor treadmill or rain-resistant gear.'
        : temp > 28
        ? 'High heat index. Stick to early mornings or shaded parks with hydration.'
        : `Wind speed (${wind} km/h) or temperatures will require extra warm-up.`,
      tips: [
        temp > 22 ? 'Bring hydration belt' : 'Dynamic warm-up recommended',
        wind > 20 ? 'Plan outbound leg into headwind' : 'Pacing conditions are favorable',
      ],
    },
    {
      id: 'cycling',
      title: 'Cycling & Commute',
      icon: 'Bike',
      score: cyclingScore,
      rating: cyclingRating,
      color: getRatingColor(cyclingRating),
      bestWindow: cyclingWindow,
      rationale: wind > 30 
        ? `Strong gusts of ${current.windGusts} km/h can affect bike stability. Ride with vigilance.`
        : isRaining 
        ? 'Traction reduced on wet asphalt. Lower tire pressure slightly and use mudguards.'
        : `Smooth atmospheric stability. Crosswinds minimal at ${wind} km/h.`,
      tips: [
        rainProb > 30 ? 'Equip front & rear safety lights' : 'Standard commuter setup ready',
        wind > 25 ? 'Expect aerodynamic resistance' : 'Low rolling resistance today',
      ],
    },
    {
      id: 'hiking',
      title: 'Hiking & Walking',
      icon: 'Footprints',
      score: hikingScore,
      rating: hikingRating,
      color: getRatingColor(hikingRating),
      bestWindow: hikingWindow,
      rationale: isRaining 
        ? 'Trail mud and slippery rocks likely. Waterproof footwear and trekking poles advised.'
        : `Moderate elevation temperatures and clear visibility (~${current.visibility || 10} km).`,
      tips: [
        uv >= 6 ? 'Apply SPF 50 sunscreen & wear brimmed hat' : 'Comfortable ambient light',
        'Pack 1.5L water per 2 hours of trail time',
      ],
    },
    {
      id: 'dining',
      title: 'Outdoor Dining & Patio',
      icon: 'UtensilsCrossed',
      score: diningScore,
      rating: diningRating,
      color: getRatingColor(diningRating),
      bestWindow: diningWindow,
      rationale: diningScore >= 80 
        ? `Balmy ${temp}°C with gentle breeze. Prime terrace and rooftop dining atmosphere.`
        : temp < 16 
        ? 'Heated patio or wind-sheltered terrace recommended due to chill.'
        : 'Intermittent precipitation risk or breezy conditions may disrupt table settings.',
      tips: [
        temp < 18 ? 'Request a heated table or bring a cardigan' : 'Prime outdoor ambiance',
        wind > 20 ? 'Indoor seating preferred for meals' : 'Calm breeze',
      ],
    },
    {
      id: 'photography',
      title: 'Landscape & Golden Hour',
      icon: 'Camera',
      score: photoScore,
      rating: photoRating,
      color: getRatingColor(photoRating),
      bestWindow: `${weather.daily[0]?.sunrise || '06:30 AM'} / ${weather.daily[0]?.sunset || '07:30 PM'}`,
      rationale: current.cloudCover > 20 && current.cloudCover < 80 
        ? `Cloud coverage (${current.cloudCover}%) provides exceptional light diffusion and sunset hues.`
        : 'High clarity atmosphere with sharp direct contrast.',
      tips: [
        'Golden hour starts ~45 min prior to sunset',
        'Polarizing filter helps cut atmospheric glare',
      ],
    },
    {
      id: 'stargazing',
      title: 'Stargazing & Astronomy',
      icon: 'Sparkles',
      score: starScore,
      rating: starRating,
      color: getRatingColor(starRating),
      bestWindow: '10:30 PM – 04:00 AM',
      rationale: isNight 
        ? current.cloudCover < 30 ? 'Crisp open skies with low obstruction.' : `Partial cloud cover (${current.cloudCover}%) may obscure constellations.`
        : 'Sky observation requires nightfall. Check tonight after 10 PM.',
      tips: [
        'Allow 20 minutes for eyes to dark-adapt',
        'Drive 15km away from urban light domes for deeper magnitude viewing',
      ],
    },
  ];
}

export function computeOutfitRecommendations(weather: WeatherData): OutfitRecommendation {
  const { current } = weather;
  const t = current.temperature;
  const feelsLike = current.apparentTemperature;
  const wind = current.windSpeed;
  const code = current.weatherCode;
  const rain = current.precipitation;
  const uv = current.uvIndex || 0;

  const isWet = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || rain > 0.2;
  const isFreezing = t <= 0;
  const isCold = t > 0 && t <= 10;
  const isCool = t > 10 && t <= 17;
  const isMild = t > 17 && t <= 23;
  const isWarm = t > 23 && t <= 29;
  const isHot = t > 29;

  const layers: string[] = [];
  let outerwear = '';
  let footwear = '';
  const accessories: string[] = [];
  let summary = '';
  let thermalAdvice = '';

  if (isFreezing) {
    summary = 'Heavy winter thermal protection needed. Sub-zero temperatures and frost risk.';
    layers.push('Thermal underwear / moisture-wicking base layer', 'Insulating wool or fleece mid-layer');
    outerwear = 'Heavy down parka with windproof & waterproof shell';
    footwear = 'Insulated waterproof winter boots with traction grip';
    accessories.push('Thermal beanie', 'Insulated gloves / mittens', 'Wool scarf');
    thermalAdvice = `Feels like ${feelsLike}°C with wind chill factor. Cover exposed skin.`;
  } else if (isCold) {
    summary = 'Chilly weather. Multi-layer insulation and wind shielding recommended.';
    layers.push('Long-sleeve cotton/merino shirt', 'Knit sweater or zip fleece');
    outerwear = 'Puffer coat, wool trench, or heavy jacket';
    footwear = 'Sturdy leather boots or warm closed shoes';
    accessories.push('Light scarf', 'Knit gloves if staying out long');
    thermalAdvice = `Air feels around ${feelsLike}°C. Layering allows adjusting between indoor and outdoor.`;
  } else if (isCool) {
    summary = 'Brisk transitional temperatures. A medium outer layer will keep you comfortable.';
    layers.push('T-shirt or button-down', 'Light sweater or cardigan');
    outerwear = 'Denim jacket, trench coat, or lightweight bomber';
    footwear = 'Sneakers, loafers, or ankle boots';
    if (wind > 25) accessories.push('Wind-blocking scarf');
    thermalAdvice = `Comfortable with a light jacket. Drops cooler in early morning and shade.`;
  } else if (isMild) {
    summary = 'Pleasant, moderate climate. Ideal for standard casual apparel.';
    layers.push('Breathable short-sleeve shirt or light long-sleeve');
    outerwear = 'Optional light zip hoodie or windbreaker for evening';
    footwear = 'Comfortable sneakers or casual shoes';
    thermalAdvice = `Thermally balanced. Low perspiration and optimal body temperature equilibrium.`;
  } else if (isWarm) {
    summary = 'Warm and pleasant. Lightweight, breathable natural fibers are best.';
    layers.push('Short-sleeve linen or cotton tee', 'Chino shorts, skirt, or light trousers');
    outerwear = 'No outer jacket needed during daylight';
    footwear = 'Breathable mesh sneakers, canvas shoes, or open sandals';
    thermalAdvice = `Gentle warmth. Stay hydrated if engaged in physical activities.`;
  } else {
    // isHot
    summary = 'Hot conditions. Maximize ventilation, light colors, and hydration.';
    layers.push('Ultra-lightweight loose clothing (linen, rayon, performance tech)');
    outerwear = 'None';
    footwear = 'Breathable sandals or lightweight ventilated shoes';
    accessories.push('UV-blocking sunglasses', 'Wide-brim sun hat');
    thermalAdvice = `High heat index. Avoid dark colors that absorb solar radiation.`;
  }

  const umbrellaNeeded = isWet || (weather.hourly[0]?.precipitationProbability || 0) > 40;
  const sunProtectionNeeded = uv >= 3;

  if (umbrellaNeeded) {
    accessories.push('Compact stormproof umbrella ☔');
    if (isWet) footwear = isFreezing ? footwear : 'Water-resistant shoes or boots';
  }

  if (sunProtectionNeeded) {
    accessories.push('Polarized sunglasses 🕶️', `Broad-spectrum SPF ${uv >= 6 ? '50+' : '30'} sunscreen 🧴`);
  }

  return {
    summary,
    layers,
    footwear,
    accessories,
    umbrellaNeeded,
    sunProtectionNeeded,
    thermalAdvice,
  };
}

export function computeHealthAndComfort(weather: WeatherData): HealthComfortMetrics {
  const { current } = weather;
  const t = current.temperature;
  const feelsLike = current.apparentTemperature;
  const hum = current.relativeHumidity;
  const uv = current.uvIndex || 0;
  const dewPoint = current.dewPoint || 12;
  const pressure = current.pressureMsl;
  const wind = current.windSpeed;
  const code = current.weatherCode;

  // 1. Thermal Comfort
  let thermalStatus: HealthComfortMetrics['thermalComfort']['status'] = 'Comfortable';
  let thermalDesc = 'Optimal thermal neutrality. Low physiological stress.';
  if (feelsLike < 0) {
    thermalStatus = 'Extreme';
    thermalDesc = 'Sub-zero chill. High risk of frostbite or numbness with prolonged exposure.';
  } else if (feelsLike < 10) {
    thermalStatus = 'Cold';
    thermalDesc = 'Brisk cold sensations. Vasoconstriction and shivering possible if underdressed.';
  } else if (feelsLike < 18) {
    thermalStatus = 'Chilly';
    thermalDesc = 'Cool ambient feel. Gentle briskness.';
  } else if (feelsLike <= 26) {
    thermalStatus = 'Comfortable';
    thermalDesc = 'Optimal comfort zone. Perfect balance of ambient warmth and airflow.';
  } else if (feelsLike <= 33) {
    thermalStatus = 'Warm';
    thermalDesc = 'Noticeable warmth. Increased perspiration during moderate exertion.';
  } else if (feelsLike <= 40) {
    thermalStatus = 'Hot';
    thermalDesc = 'Elevated heat strain. Fatigue possible with prolonged outdoor exertion.';
  } else {
    thermalStatus = 'Extreme';
    thermalDesc = 'Dangerously high heat index. Risk of heat exhaustion or heat stroke.';
  }

  // 2. UV Risk & Safe sun exposure
  let uvLevel = 'Low';
  let safeMin = 60;
  let uvAdvice = 'Minimal sun protection needed for short exposure.';
  if (uv >= 11) {
    uvLevel = 'Extreme';
    safeMin = 10;
    uvAdvice = 'Stay in shade. High burn hazard within 10 minutes. Full SPF 50+ & protective clothing.';
  } else if (uv >= 8) {
    uvLevel = 'Very High';
    safeMin = 15;
    uvAdvice = 'Extra protection required. Avoid direct sun between 11 AM - 4 PM.';
  } else if (uv >= 6) {
    uvLevel = 'High';
    safeMin = 25;
    uvAdvice = 'Wear hat, sunglasses, and reapply sunscreen every 2 hours.';
  } else if (uv >= 3) {
    uvLevel = 'Moderate';
    safeMin = 45;
    uvAdvice = 'Wear sunglasses and apply sunscreen during midday peak.';
  }

  // 3. Humidity Comfort
  let humLevel: HealthComfortMetrics['humidityComfort']['level'] = 'Pleasant';
  if (dewPoint < 5 || hum < 30) {
    humLevel = 'Dry';
  } else if (dewPoint > 21 || hum > 85) {
    humLevel = 'Oppressive';
  } else if (dewPoint > 16 || hum > 70) {
    humLevel = 'Humid';
  }

  // 4. Pressure Trend & Migraine
  let migraineRisk: HealthComfortMetrics['pressureTrend']['migraineRisk'] = 'Low';
  let trend: HealthComfortMetrics['pressureTrend']['trend'] = 'Steady';
  if (pressure < 1005) {
    trend = 'Falling';
    migraineRisk = 'Elevated';
  } else if (pressure > 1022) {
    trend = 'Rising';
    migraineRisk = 'Low';
  }

  // 5. Commute Safety
  let commuteStatus: HealthComfortMetrics['commuteSafety']['status'] = 'Clear';
  let commuteDetails = 'Dry roads, standard visibility, and calm transit conditions.';
  let commuteScore = 95;

  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isThunder = code >= 95;
  const isFog = code === 45 || code === 48;
  const isSnow = code >= 71 && code <= 77;

  if (isThunder) {
    commuteStatus = 'Hazardous';
    commuteDetails = 'Thunderstorms & lightning present. Water ponding and reduced visibility.';
    commuteScore = 30;
  } else if (isSnow) {
    commuteStatus = 'Hazardous';
    commuteDetails = 'Snow & slick surfaces. Allow 2x braking distance and check road salting.';
    commuteScore = 40;
  } else if (isFog || (current.visibility && current.visibility < 3)) {
    commuteStatus = 'Low Visibility';
    commuteDetails = `Dense fog / reduced sightlines (~${current.visibility || 1} km). Use low-beam fog lights.`;
    commuteScore = 55;
  } else if (wind > 45) {
    commuteStatus = 'High Wind Warning';
    commuteDetails = `Crosswinds reaching ${wind} km/h (gusts ${current.windGusts} km/h). Caution with high-profile vehicles.`;
    commuteScore = 60;
  } else if (isRain) {
    commuteStatus = 'Wet Roads';
    commuteDetails = 'Wet pavement increases stopping distance. Watch for hydroplaning in ruts.';
    commuteScore = 70;
  }

  return {
    thermalComfort: {
      label: thermalStatus,
      description: thermalDesc,
      status: thermalStatus,
    },
    uvRisk: {
      index: uv,
      level: uvLevel,
      maxExposureMinutes: safeMin,
      advice: uvAdvice,
    },
    humidityComfort: {
      percentage: hum,
      dewPoint,
      level: humLevel,
    },
    pressureTrend: {
      pressure,
      trend,
      migraineRisk,
    },
    commuteSafety: {
      status: commuteStatus,
      details: commuteDetails,
      score: commuteScore,
    },
  };
}
