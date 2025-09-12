import axios from 'axios';

const WEATHER_API_KEY = 'e75ae4dc9220448ea0c65939251209';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  name?: string;
  location?: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  current?: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    wind_degree: number;
    condition: {
      text: string;
      icon: string;
    };
    vis_km: number;
    cloud: number;
  };
  weather?: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
    deg: number;
  };
  sys?: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord?: {
    lat: number;
    lon: number;
  };
  visibility?: number;
  clouds?: {
    all: number;
  };
}

export interface SearchHistoryItem {
  city: string;
  country: string;
  temperature: number | null;
  timestamp: string;
}

class WeatherService {
  private async makeRequest(city?: string, lat?: number, lon?: number) {
    try {
      let url;
      if (city) {
        url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${city}`;
      } else if (lat && lon) {
        url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;
      } else {
        throw new Error('City or coordinates are required');
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    return this.makeRequest(city);
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    return this.makeRequest(undefined, lat, lon);
  }

  async logSearch(city: string, country: string, temperature: number | null): Promise<void> {
    // For now, just save to localStorage since we're calling WeatherAPI directly
    this.saveToLocalSearchHistory({
      city,
      country,
      temperature,
      timestamp: new Date().toISOString(),
    });
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    // Return local search history since we're calling WeatherAPI directly
    return this.getLocalSearchHistory();
  }

  // Local storage fallback for search history
  getLocalSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem('weather-search-history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to parse local search history:', error);
      return [];
    }
  }

  saveToLocalSearchHistory(item: SearchHistoryItem): void {
    if (typeof window === 'undefined') return;
    
    try {
      const history = this.getLocalSearchHistory();
      const newHistory = [item, ...history.filter(h => h.city !== item.city)].slice(0, 10);
      localStorage.setItem('weather-search-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save to local search history:', error);
    }
  }
}

export const weatherService = new WeatherService();
