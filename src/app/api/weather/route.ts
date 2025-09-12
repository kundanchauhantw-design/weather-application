import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const WEATHER_API_KEY = 'e75ae4dc9220448ea0c65939251209';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!WEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    let url: string;
    if (city) {
      url = `${WEATHER_API_BASE}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (lat && lon) {
      url = `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      return NextResponse.json(
        { error: 'City or coordinates (lat, lon) parameters are required' },
        { status: 400 }
      );
    }

    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch weather data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
