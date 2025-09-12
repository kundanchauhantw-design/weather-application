'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { weatherService, SearchHistoryItem } from '@/services/weatherService';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SearchHistoryPage() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from backend first, fallback to localStorage
      const backendHistory = await weatherService.getSearchHistory();
      const localHistory = weatherService.getLocalSearchHistory();
      
      // Merge and deduplicate, prioritizing backend data
      const mergedHistory = [...backendHistory, ...localHistory.filter(
        local => !backendHistory.some(backend => backend.city === local.city)
      )];
      
      // Sort by timestamp (most recent first)
      mergedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setSearchHistory(mergedHistory.slice(0, 20)); // Limit to 20 items
    } catch (err: any) {
      console.error('Failed to load search history:', err);
      // Fallback to localStorage only
      const localHistory = weatherService.getLocalSearchHistory();
      setSearchHistory(localHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = async (city: string) => {
    try {
      const weatherData = await weatherService.getWeatherByCity(city);
      const cityName = weatherData.name || weatherData.location?.name || 'Unknown';
      const coords = weatherData.coord || weatherData.location;
      const lat = coords?.lat || 0;
      const lon = coords?.lon || 0;
      router.push(`/weather-details?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    }
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('weather-search-history');
      setSearchHistory([]);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading search history..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Search History
        </h1>
        <p className="text-xl text-white/90">
          Your recently searched cities
        </p>
      </div>

      {error && (
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

      {searchHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            No Search History
          </h2>
          <p className="text-white/80 mb-6">
            Start searching for cities to see your history here
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-white/80">
              {searchHistory.length} {searchHistory.length === 1 ? 'city' : 'cities'} searched
            </p>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
            >
              Clear History
            </button>
          </div>

          <div className="grid gap-4">
            {searchHistory.map((item) => (
              <div
                key={`${item.city}-${item.timestamp}`}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer"
                onClick={() => handleCityClick(item.city)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.city}
                        {item.country && (
                          <span className="text-white/60 ml-2">({item.country})</span>
                        )}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {item.temperature !== null && (
                      <div className="text-2xl font-bold text-white">
                        {Math.round(item.temperature)}°C
                      </div>
                    )}
                    <div className="text-white/60 text-sm">
                      Click to view details
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 text-center">
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
