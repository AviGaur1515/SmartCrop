import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, Leaf, Search, MapPin, Thermometer, CloudRain, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LOCATION_KEY = 'smartcrop_weather_location';

const WeatherWidget = () => {
    const [location, setLocation] = useState(() => localStorage.getItem(LOCATION_KEY) || 'Ahmedabad');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    // Weather interpretation logic
    const getAgriculturalAdvice = (temp, humidity, code) => {
        if (code >= 95) return "Storm warning: Delay all spraying and harvesting. Secure loose equipment.";
        if (code >= 51 && code <= 67) return "Rainy conditions: Fungal disease risk is high. Avoid irrigation.";
        if (temp > 35) return "Heat stress alert: Ensure adequate irrigation. Apply mulch to retain moisture.";
        if (temp < 10) return "Cold stress: Protect sensitive seedlings from frost.";
        if (humidity > 85) return "High humidity: Monitor closely for blight and mildew symptoms.";
        if (humidity < 30) return "Low humidity: Increase watering frequency to prevent wilting.";
        return "Optimal conditions: Good for field inspection and general maintenance.";
    };

    const getWeatherIcon = (code) => {
        if (code <= 3) return Sun;
        if (code <= 48) return Cloud;
        if (code <= 67) return CloudRain;
        if (code >= 95) return CloudRain;
        return Sun;
    };

    const getWeatherCondition = (code) => {
        const codes = {
            0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing Rime Fog",
            51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
            61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
            71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
            95: "Thunderstorm"
        };
        return codes[code] || "Conditions Vary";
    };

    // Autocomplete: fetch suggestions as user types
    const fetchSuggestions = async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await axios.get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
            );
            if (res.data.results) {
                setSuggestions(res.data.results.map(r => ({
                    name: r.name,
                    country: r.country,
                    admin1: r.admin1 || '',
                    latitude: r.latitude,
                    longitude: r.longitude,
                    display: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}, ${r.country}`
                })));
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
            }
        } catch {
            setSuggestions([]);
        }
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Debounce the API call
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    const handleSelectCity = (suggestion) => {
        const displayName = `${suggestion.name}, ${suggestion.country}`;
        setLocation(displayName);
        localStorage.setItem(LOCATION_KEY, displayName);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
        fetchWeatherByCoords(suggestion.latitude, suggestion.longitude, displayName);
    };

    const fetchWeatherByCoords = async (lat, lon, name) => {
        try {
            setLoading(true);
            const weatherRes = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            );
            const current = weatherRes.data.current;
            setWeather({
                temp: Math.round(current.temperature_2m),
                humidity: current.relative_humidity_2m,
                wind: current.wind_speed_10m,
                code: current.weather_code,
                condition: getWeatherCondition(current.weather_code),
                icon: getWeatherIcon(current.weather_code),
                advice: getAgriculturalAdvice(current.temperature_2m, current.relative_humidity_2m, current.weather_code)
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = async (city) => {
        try {
            setLoading(true);
            const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            if (!geoRes.data.results || geoRes.data.results.length === 0) {
                toast.error("Location not found");
                setLoading(false);
                return;
            }
            const { latitude, longitude, name, country } = geoRes.data.results[0];
            const displayName = `${name}, ${country}`;
            setLocation(displayName);
            localStorage.setItem(LOCATION_KEY, displayName);
            await fetchWeatherByCoords(latitude, longitude, displayName);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch weather data");
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setShowSuggestions(false);
        fetchWeather(searchQuery);
        setSearchQuery('');
        setIsSearching(false);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                    const cityName = res.data.city || res.data.locality || "Current Location";
                    setLocation(cityName);
                    localStorage.setItem(LOCATION_KEY, cityName);
                    await fetchWeatherByCoords(lat, lon, cityName);
                } catch (err) {
                    setLocation("Current Location");
                    await fetchWeatherByCoords(lat, lon, "Current Location");
                }
            },
            (error) => {
                toast.error("Unable to retrieve your location. Check browser permissions.");
                setLoading(false);
            }
        );
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
                if (!searchQuery) setIsSearching(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery]);

    useEffect(() => {
        fetchWeather(location);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] p-8 relative overflow-hidden text-slate-800"
        >
            {/* Header & Search */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-emerald-600" />
                        Live Field Conditions
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                    </div>
                </div>

                <div className="relative" ref={searchRef}>
                    <AnimatePresence>
                        {isSearching ? (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 250, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="absolute right-0 top-0"
                            >
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Type a city name..."
                                        className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-100 border-none text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                        value={searchQuery}
                                        onChange={handleSearchInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setIsSearching(false); setSearchQuery(''); setSuggestions([]); }}
                                        className="absolute right-2 top-2"
                                    >
                                        <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                    </button>
                                </form>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-1 right-0 w-full bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSelectCity(s)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 border-b border-stone-50 last:border-none"
                                            >
                                                <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                                                <span className="font-medium text-slate-700">{s.display}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                                <button
                                    onClick={detectLocation}
                                    className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                    title="Auto-detect my location"
                                >
                                    <MapPin className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setIsSearching(true)}
                                    className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <Search className="h-5 w-5 text-slate-600" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : weather && (
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-start">
                                <span className="text-6xl font-display font-bold text-slate-900">{weather.temp}</span>
                                <span className="text-2xl font-bold text-slate-400 mt-2">°C</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                                    {weather.condition}
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
                            <weather.icon className="h-24 w-24 text-emerald-600 relative z-10 drop-shadow-xl" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <Droplets className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Humidity</p>
                                <p className="text-lg font-bold text-slate-700">{weather.humidity}%</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3">
                            <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                                <Wind className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Wind</p>
                                <p className="text-lg font-bold text-slate-700">{weather.wind} km/h</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                        <div className="flex items-start space-x-3">
                            <Leaf className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wide">Farmer's Insight</p>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    {weather.advice}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default WeatherWidget;
