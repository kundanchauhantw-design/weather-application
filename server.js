const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for search history (in production, use a database)
let searchHistory = [];

// WeatherAPI configuration
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'e75ae4dc9220448ea0c65939251209';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

// Helper function to fetch weather data
const fetchWeatherData = async (lat, lon, city = null) => {
  try {
    let url;
    if (city) {
      url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${city}`;
    } else {
      url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;
    }
    console.log(url);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Weather data fetch failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

// API Routes

// GET /api/weather?city=XYZ - Returns weather data for a given city
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const weatherData = await fetchWeatherData(null, null, city);
    
    // Add to search history
    const searchEntry = {
      city: weatherData.name,
      country: weatherData.sys.country,
      timestamp: new Date().toISOString(),
      temperature: weatherData.main.temp
    };
    searchHistory.unshift(searchEntry);
    
    // Keep only last 10 searches
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10);
    }

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/current - Returns weather data based on user's coordinates
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const weatherData = await fetchWeatherData(lat, lon);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/search - Logs the searched city
app.post('/api/search', (req, res) => {
  try {
    const { city, country, temperature } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const searchEntry = {
      city,
      country: country || '',
      temperature: temperature || null,
      timestamp: new Date().toISOString()
    };
    
    searchHistory.unshift(searchEntry);
    
    // Keep only last 10 searches
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10);
    }

    res.json({ message: 'Search logged successfully', search: searchEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/searches - Retrieves previously searched cities
app.get('/api/searches', (req, res) => {
  try {
    res.json(searchHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Weather API Key configured: ${WEATHER_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;
