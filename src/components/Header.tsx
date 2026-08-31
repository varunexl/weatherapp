import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Compass, 
  Bookmark, 
  BookmarkCheck, 
  RotateCw, 
  Thermometer, 
  Wind,
  Sparkles,
  X,
  ChevronDown
} from 'lucide-react';
import { LocationSearchResult, TempUnit, WindUnit } from '../types';
import { searchLocations } from '../utils/api';

interface HeaderProps {
  currentLocation: LocationSearchResult | null;
  onSelectLocation: (loc: LocationSearchResult) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  tempUnit: TempUnit;
  onToggleTempUnit: (unit: TempUnit) => void;
  windUnit: WindUnit;
  onToggleWindUnit: (unit: WindUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedLocations: LocationSearchResult[];
  onToggleSaveLocation: (loc: LocationSearchResult) => void;
  isCurrentSaved: boolean;
}

const PRESET_CITIES: LocationSearchResult[] = [
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 5128581, name: 'New York', admin1: 'New York', country: 'United States', country_code: 'US', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { id: 2968815, name: 'Paris', admin1: 'Île-de-France', country: 'France', country_code: 'FR', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 5391959, name: 'San Francisco', admin1: 'California', country: 'United States', country_code: 'US', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { id: 1880252, name: 'Singapore', country: 'Singapore', country_code: 'SG', latitude: 1.2897, longitude: 103.8501, timezone: 'Asia/Singapore' },
  { id: 2147714, name: 'Sydney', admin1: 'New South Wales', country: 'Australia', country_code: 'AU', latitude: -33.8679, longitude: 151.2073, timezone: 'Australia/Sydney' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onLocateMe,
  isLocating,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onToggleWindUnit,
  onRefresh,
  isRefreshing,
  savedLocations,
  onToggleSaveLocation,
  isCurrentSaved,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const data = await searchLocations(query);
      setResults(data);
      setIsSearching(false);
      setIsOpen(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationSearchResult) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Brand & Live Location Indicator */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10">
                <Compass className="w-5 h-5 animate-[spin_16s_linear_infinite] text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-display">
                    Aether<span className="font-light opacity-80">Weather</span>
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-teal-200 border border-white/20 backdrop-blur-md">
                    <Sparkles className="w-2.5 h-2.5" />
                    Frosted Edition
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  {currentLocation ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-300 inline shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-[280px]">
                        {currentLocation.name}{currentLocation.admin1 ? `, ${currentLocation.admin1}` : ''}{currentLocation.country ? `, ${currentLocation.country}` : ''}
                      </span>
                    </span>
                  ) : (
                    'Atmospheric intelligence & planning'
                  )}
                </p>
              </div>
            </div>

            {/* Mobile Actions: Bookmark & Refresh */}
            <div className="flex items-center gap-1.5 md:hidden">
              {currentLocation && (
                <button
                  id="mobile-bookmark-btn"
                  onClick={() => onToggleSaveLocation(currentLocation)}
                  aria-label={isCurrentSaved ? "Remove city from favorites" : "Save city to favorites"}
                  className={`p-2 rounded-xl text-xs border backdrop-blur-md transition-all ${
                    isCurrentSaved
                      ? 'bg-amber-400/30 text-amber-200 border-amber-300/40 shadow-sm'
                      : 'bg-white/10 text-white/80 hover:text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {isCurrentSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              )}
              <button
                id="mobile-refresh-btn"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="Refresh weather data"
                className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-300' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Box & Controls */}
          <div className="flex flex-1 items-center justify-end gap-2.5 max-w-2xl">
            
            {/* Search Input Container */}
            <div ref={searchContainerRef} className="relative flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-white/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="city-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setIsOpen(true);
                  }}
                  placeholder="Search for a city or region..."
                  className="w-full pl-11 pr-8 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 shadow-inner transition-all"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/25 rounded-3xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-white/10 text-white">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-white/70 flex items-center justify-center gap-2">
                      <RotateCw className="w-4 h-4 animate-spin text-teal-300" />
                      Searching meteorological coordinates...
                    </div>
                  ) : results.length > 0 ? (
                    results.map((item) => (
                      <button
                        key={`${item.id}-${item.latitude}-${item.longitude}`}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-5 py-3 hover:bg-white/15 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-teal-300 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-white/70">
                              {[item.admin1, item.country].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-white/80 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                          {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-white/60">
                      No matching cities found. Check spelling or try a larger city.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Locate Me GPS Button */}
            <button
              id="locate-me-btn"
              onClick={onLocateMe}
              disabled={isLocating}
              title="Use GPS location"
              className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium shrink-0 shadow-sm"
            >
              <Compass className={`w-3.5 h-3.5 text-teal-300 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'GPS'}</span>
            </button>

            {/* Saved Locations Dropdown */}
            <div className="relative">
              <button
                id="saved-cities-btn"
                onClick={() => setIsSavedDrawerOpen(!isSavedDrawerOpen)}
                className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium shrink-0 shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Favorites</span>
                {savedLocations.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400/30 text-amber-200 text-[10px] flex items-center justify-center font-bold border border-amber-300/40">
                    {savedLocations.length}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              {isSavedDrawerOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/25 rounded-3xl shadow-2xl z-50 p-3 divide-y divide-white/10 text-white">
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Saved Cities</span>
                    <span className="text-[11px] text-white/60">{savedLocations.length} total</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                    {savedLocations.length === 0 ? (
                      <p className="p-3 text-xs text-center text-white/60">
                        No saved cities yet. Bookmark any city to save for quick access.
                      </p>
                    ) : (
                      savedLocations.map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-white/15 group transition-colors"
                        >
                          <button
                            onClick={() => {
                              onSelectLocation(city);
                              setIsSavedDrawerOpen(false);
                            }}
                            className="text-left flex-1 text-xs text-white group-hover:text-teal-200 truncate font-medium"
                          >
                            {city.name}, <span className="text-white/60">{city.country_code || city.country}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaveLocation(city);
                            }}
                            title="Remove from favorites"
                            className="p-1 text-white/50 hover:text-rose-300 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Units Toggle Group */}
            <div className="flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1 shrink-0">
              <button
                id="unit-celsius-btn"
                onClick={() => onToggleTempUnit('celsius')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  tempUnit === 'celsius'
                    ? 'bg-white/30 text-white shadow-md border border-white/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                id="unit-fahrenheit-btn"
                onClick={() => onToggleTempUnit('fahrenheit')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-white/30 text-white shadow-md border border-white/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Desktop Actions: Bookmark Current & Refresh */}
            <div className="hidden md:flex items-center gap-2">
              {currentLocation && (
                <button
                  id="desktop-bookmark-btn"
                  onClick={() => onToggleSaveLocation(currentLocation)}
                  title={isCurrentSaved ? 'Remove from saved' : 'Bookmark location'}
                  className={`p-2.5 rounded-full text-xs border backdrop-blur-md transition-all ${
                    isCurrentSaved
                      ? 'bg-amber-400/30 text-amber-200 border-amber-300/40 shadow-md'
                      : 'bg-white/10 text-white/80 hover:text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {isCurrentSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              )}
              <button
                id="desktop-refresh-btn"
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Refresh weather data"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-sm"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-300' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Quick Popular Presets bar */}
        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-300" />
            Quick Presets:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {PRESET_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border backdrop-blur-md ${
                  currentLocation?.id === city.id || currentLocation?.name === city.name
                    ? 'bg-white/30 text-white border-white/40 shadow-sm font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-white/85 hover:text-white border-white/15'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
};
