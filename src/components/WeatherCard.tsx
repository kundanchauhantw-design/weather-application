'use client';

import { WeatherData } from '@/services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
  onClick?: () => void;
  showDetailsButton?: boolean;
}

const WeatherCard = ({ weather, onClick, showDetailsButton = false }: WeatherCardProps) => {
  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatWindSpeed = (speed: number) => `${speed.toFixed(1)} km/h`;
  const formatVisibility = (visibility: number) => `${visibility.toFixed(1)} km`;
  const formatPressure = (pressure: number) => `${pressure} hPa`;

  // Helper functions to get data from either API format
  const getCityName = () => weather.name || weather.location?.name || 'Unknown';
  const getCountry = () => weather.sys?.country || weather.location?.country || '';
  const getTemperature = () => weather.main?.temp || weather.current?.temp_c || 0;
  const getFeelsLike = () => weather.main?.feels_like || weather.current?.feelslike_c || 0;
  const getHumidity = () => weather.main?.humidity || weather.current?.humidity || 0;
  const getPressure = () => weather.main?.pressure || weather.current?.pressure_mb || 0;
  const getWindSpeed = () => weather.wind?.speed || weather.current?.wind_kph || 0;
  const getWindDegree = () => weather.wind?.deg || weather.current?.wind_degree || 0;
  const getVisibility = () => weather.visibility || weather.current?.vis_km || 0;
  const getCloudiness = () => weather.clouds?.all || weather.current?.cloud || 0;
  const getWeatherCondition = () => weather.weather?.[0] || weather.current?.condition;
  const getWeatherIcon = () => getWeatherCondition()?.icon || '';
  const getWeatherDescription = () => {
    const condition = getWeatherCondition();
    return (condition as any)?.description || (condition as any)?.text || '';
  };

  const formatWeatherIcon = (iconCode: string) => {
    // Handle both OpenWeatherMap and WeatherAPI icon formats
    if (iconCode.startsWith('//')) {
      return `https:${iconCode}`;
    }
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg ${
        onClick ? 'cursor-pointer hover:bg-white/15 transition-all duration-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{getCityName()}</h2>
          <p className="text-white/80">{getCountry()}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">
            {formatTemperature(getTemperature())}
          </div>
          <p className="text-white/80 capitalize">
            {getWeatherDescription()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <img
          src={formatWeatherIcon(getWeatherIcon())}
          alt={getWeatherDescription()}
          className="w-20 h-20"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-white/60 text-sm">Feels Like</div>
          <div className="text-white font-semibold">
            {formatTemperature(getFeelsLike())}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white/60 text-sm">Humidity</div>
          <div className="text-white font-semibold">{getHumidity()}%</div>
        </div>
        
        <div className="text-center">
          <div className="text-white/60 text-sm">Wind</div>
          <div className="text-white font-semibold">
            {formatWindSpeed(getWindSpeed())} {getWindDirection(getWindDegree())}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white/60 text-sm">Pressure</div>
          <div className="text-white font-semibold">{formatPressure(getPressure())}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Min Temp:</span>
          <span className="text-white">{formatTemperature(getTemperature() - 2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Max Temp:</span>
          <span className="text-white">{formatTemperature(getTemperature() + 2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Visibility:</span>
          <span className="text-white">{formatVisibility(getVisibility())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Cloudiness:</span>
          <span className="text-white">{getCloudiness()}%</span>
        </div>
      </div>

      {showDetailsButton && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors">
            View Detailed Forecast
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
