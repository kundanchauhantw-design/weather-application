'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { weatherService, WeatherData } from '@/services/weatherService';
import LoadingSpinner from '@/components/LoadingSpinner';

function WeatherDetailsContent() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (city && lat && lon) {
      loadWeatherDetails(city, parseFloat(lat), parseFloat(lon));
    } else {
      setError('Invalid weather data parameters');
      setLoading(false);
    }
  }, [searchParams]);

  const loadWeatherDetails = async (city: string, _lat: number, _lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const weatherData = await weatherService.getWeatherByCity(city);
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather details');
    } finally {
      setLoading(false);
    }
  };

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatWindSpeed = (speed: number) => `${speed.toFixed(1)} km/h`;
  const formatVisibility = (visibility: number) => `${visibility.toFixed(1)} km`;
  const formatPressure = (pressure: number) => `${pressure} hPa`;
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper functions to get data from either API format
  const getCityName = () => weather?.name || weather?.location?.name || 'Unknown';
  const getCountry = () => weather?.sys?.country || weather?.location?.country || '';
  const getTemperature = () => weather?.main?.temp || weather?.current?.temp_c || 0;
  const getFeelsLike = () => weather?.main?.feels_like || weather?.current?.feelslike_c || 0;
  const getHumidity = () => weather?.main?.humidity || weather?.current?.humidity || 0;
  const getPressure = () => weather?.main?.pressure || weather?.current?.pressure_mb || 0;
  const getWindSpeed = () => weather?.wind?.speed || weather?.current?.wind_kph || 0;
  const getWindDegree = () => weather?.wind?.deg || weather?.current?.wind_degree || 0;
  const getVisibility = () => weather?.visibility || weather?.current?.vis_km || 0;
  const getCloudiness = () => weather?.clouds?.all || weather?.current?.cloud || 0;
  const getWeatherCondition = () => weather?.weather?.[0] || weather?.current?.condition;
  const getWeatherIcon = () => getWeatherCondition()?.icon || '';
  const getWeatherDescription = () => {
    const condition = getWeatherCondition();
    return (condition as any)?.description || (condition as any)?.text || '';
  };
  const getCoordinates = () => weather?.coord || weather?.location;

  const formatWeatherIcon = (iconCode: string) => {
    // Handle both OpenWeatherMap and WeatherAPI icon formats
    if (iconCode.startsWith('//')) {
      return `https:${iconCode}`;
    }
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return <LoadingSpinner text="Loading weather details..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="text-red-200 text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-200 font-semibold mb-2">Error</h3>
              <p className="text-red-100">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Weather Data Not Found
        </h2>
        <p className="text-white/80 mb-6">
          Unable to load weather details for this location
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Weather Details
        </h1>
        <p className="text-xl text-white/90">
          Comprehensive weather information for {getCityName()}, {getCountry()}
        </p>
      </div>

      {/* Main Weather Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-2">{getCityName()}</h2>
            <p className="text-white/80 text-lg">{getCountry()}</p>
            <p className="text-white/60 capitalize">
              {getWeatherDescription()}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <img
              src={formatWeatherIcon(getWeatherIcon())}
              alt={getWeatherDescription()}
              className="w-24 h-24"
            />
            <div className="text-center">
              <div className="text-6xl font-bold text-white">
                {formatTemperature(getTemperature())}
              </div>
              <p className="text-white/80">
                Feels like {formatTemperature(getFeelsLike())}
              </p>
            </div>
          </div>
        </div>

        {/* Temperature Range */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-white/60 text-sm mb-1">Min Temperature</div>
            <div className="text-2xl font-bold text-white">
              {formatTemperature(getTemperature() - 2)}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-white/60 text-sm mb-1">Max Temperature</div>
            <div className="text-2xl font-bold text-white">
              {formatTemperature(getTemperature() + 2)}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Humidity */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">💧</div>
            <h3 className="text-xl font-semibold text-white">Humidity</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {getHumidity()}%
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-blue-400 h-2 rounded-full" 
              style={{ width: `${getHumidity()}%` }}
            ></div>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">💨</div>
            <h3 className="text-xl font-semibold text-white">Wind</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatWindSpeed(getWindSpeed())}
          </div>
          <div className="text-white/80">
            Direction: {getWindDirection(getWindDegree())}
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">📊</div>
            <h3 className="text-xl font-semibold text-white">Pressure</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatPressure(getPressure())}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">👁️</div>
            <h3 className="text-xl font-semibold text-white">Visibility</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatVisibility(getVisibility())}
          </div>
        </div>

        {/* Cloudiness */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">☁️</div>
            <h3 className="text-xl font-semibold text-white">Cloudiness</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {getCloudiness()}%
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gray-400 h-2 rounded-full" 
              style={{ width: `${getCloudiness()}%` }}
            ></div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">📍</div>
            <h3 className="text-xl font-semibold text-white">Location</h3>
          </div>
          <div className="text-white/80">
            <div>Lat: {getCoordinates()?.lat?.toFixed(4) || 'N/A'}</div>
            <div>Lon: {getCoordinates()?.lon?.toFixed(4) || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset - Only show if available */}
      {(weather?.sys?.sunrise && weather?.sys?.sunset) && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Sun Times
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌅</div>
              <div className="text-white/60 text-sm mb-1">Sunrise</div>
              <div className="text-2xl font-bold text-white">
                {formatTime(weather.sys.sunrise)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌇</div>
              <div className="text-white/60 text-sm mb-1">Sunset</div>
              <div className="text-2xl font-bold text-white">
                {formatTime(weather.sys.sunset)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeatherDetailsPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading weather details..." />}>
      <WeatherDetailsContent />
    </Suspense>
  );
}
