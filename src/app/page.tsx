'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { weatherService, WeatherData } from '@/services/weatherService';
import WeatherCard from '@/components/WeatherCard';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const router = useRouter();

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLocationPermission('denied');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);
          setCurrentWeather(weatherData);
          setLocationPermission('granted');
          
          // Log the search
          const cityName = weatherData.name || weatherData.location?.name || 'Unknown';
          const country = weatherData.sys?.country || weatherData.location?.country || '';
          const temperature = weatherData.main?.temp || weatherData.current?.temp_c || 0;
          
          await weatherService.logSearch(cityName, country, temperature);
          weatherService.saveToLocalSearchHistory({
            city: cityName,
            country: country,
            temperature: temperature,
            timestamp: new Date().toISOString(),
          });
        } catch (err: any) {
          setError(err.message || 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationPermission('denied');
        setError('Location access denied. Please enable location services or search for a city manually.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const weatherData = await weatherService.getWeatherByCity(city);
      setCurrentWeather(weatherData);
      
      // Log the search
      const cityName = weatherData.name || weatherData.location?.name || 'Unknown';
      const country = weatherData.sys?.country || weatherData.location?.country || '';
      const temperature = weatherData.main?.temp || weatherData.current?.temp_c || 0;
      
      await weatherService.logSearch(cityName, country, temperature);
      weatherService.saveToLocalSearchHistory({
        city: cityName,
        country: country,
        temperature: temperature,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleWeatherCardClick = (weatherData: WeatherData) => {
    const cityName = weatherData.name || weatherData.location?.name || 'Unknown';
    const coords = weatherData.coord || weatherData.location;
    const lat = coords?.lat || 0;
    const lon = coords?.lon || 0;
    router.push(`/weather-details?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Weather Forecast
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Get current weather conditions for your location or search for any city
        </p>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {loading && <LoadingSpinner />}

      {error && locationPermission !== 'denied' && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="text-red-200 text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-200 font-semibold mb-2">Error</h3>
              <p className="text-red-100">{error}</p>
            </div>
          </div>
        </div>
      )}

      {locationPermission === 'denied' && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="text-blue-200 text-2xl mr-3">📍</div>
            <div>
              <h3 className="text-blue-200 font-semibold mb-2">Location Access</h3>
              <p className="text-blue-100 mb-3">
                To get weather for your current location, please allow location access in your browser or search for a city manually.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={getCurrentLocationWeather}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-md transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setLocationPermission('prompt')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors"
                >
                  Search City Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentWeather && !loading && (
        <div className="mb-8">
          <WeatherCard 
            weather={currentWeather} 
            onClick={() => handleWeatherCardClick(currentWeather)}
            showDetailsButton={true}
          />
        </div>
      )}

      {!currentWeather && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome to Weather App
          </h2>
          <p className="text-white/80">
            Allow location access or search for a city to get started
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-3">📍 Current Location</h3>
          <p className="text-white/80">
            Get instant weather updates for your current location using GPS coordinates.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-3">🔍 Search Cities</h3>
          <p className="text-white/80">
            Search for weather information in any city worldwide with our search feature.
          </p>
        </div>
      </div>
    </div>
  );
}