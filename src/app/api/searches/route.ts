import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for search history (in production, use a database)
let searchHistory: Array<{
  city: string;
  country: string;
  temperature: number | null;
  timestamp: string;
}> = [];

export async function GET() {
  try {
    return NextResponse.json(searchHistory);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, country, temperature } = body;

    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
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

    return NextResponse.json({ 
      message: 'Search logged successfully', 
      search: searchEntry 
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to log search' },
      { status: 500 }
    );
  }
}
