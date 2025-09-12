'use client';

import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  const features = [
    {
      icon: '🌍',
      title: 'Current Location Weather',
      description: 'Get instant weather updates for your current location using GPS coordinates and geolocation API.'
    },
    {
      icon: '🔍',
      title: 'City Search',
      description: 'Search for weather information in any city worldwide with our comprehensive search functionality.'
    },
    {
      icon: '📊',
      title: 'Detailed Weather Data',
      description: 'View comprehensive weather information including temperature, humidity, wind speed, pressure, and more.'
    },
    {
      icon: '📝',
      title: 'Search History',
      description: 'Keep track of your previously searched cities with persistent search history storage.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Fully responsive design that works seamlessly across desktop, tablet, and mobile devices.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Get real-time weather data with fast API responses and efficient data caching.'
    }
  ];

  const techStack = [
    { category: 'Frontend', items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'RESTful APIs'] },
    { category: 'APIs', items: ['OpenWeatherMap API', 'Geolocation API'] },
    { category: 'Deployment', items: ['Vercel', 'Railway/Render'] },
    { category: 'Tools', items: ['ESLint', 'Git', 'npm'] }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          About Weather App
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          A modern, full-stack weather application built as a coding challenge demonstration. 
          This app showcases frontend development, backend API integration, and deployment skills.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Features Implemented
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((stack, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {stack.category}
              </h3>
              <ul className="space-y-2">
                {stack.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-white/80 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* API Information */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          API Integration
        </h2>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                🌤️ OpenWeatherMap API
              </h3>
              <p className="text-white/80 mb-4">
                This application uses the OpenWeatherMap API to fetch real-time weather data. 
                The API provides comprehensive weather information including:
              </p>
              <ul className="text-white/80 space-y-2">
                <li>• Current temperature and weather conditions</li>
                <li>• Humidity, pressure, and wind data</li>
                <li>• Visibility and cloudiness information</li>
                <li>• Sunrise and sunset times</li>
                <li>• Weather icons and descriptions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                📍 Geolocation API
              </h3>
              <p className="text-white/80 mb-4">
                The browser&apos;s Geolocation API is used to get the user&apos;s current location 
                for automatic weather updates. This includes:
              </p>
              <ul className="text-white/80 space-y-2">
                <li>• GPS coordinates (latitude/longitude)</li>
                <li>• High accuracy location detection</li>
                <li>• Permission handling and error management</li>
                <li>• Fallback to manual city search</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Backend API Endpoints */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Backend API Endpoints
        </h2>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="space-y-6">
            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                GET /api/weather?city=XYZ
              </h3>
              <p className="text-white/80">
                Returns weather data for a specified city. Automatically logs the search to history.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                GET /api/weather/current?lat=X&lon=Y
              </h3>
              <p className="text-white/80">
                Returns weather data based on user&apos;s GPS coordinates (latitude and longitude).
              </p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                POST /api/search
              </h3>
              <p className="text-white/80">
                Logs a searched city with timestamp and temperature data for history tracking.
              </p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                GET /api/searches
              </h3>
              <p className="text-white/80">
                Retrieves the list of previously searched cities with timestamps and weather data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Persistence */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Data Persistence
        </h2>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                🗄️ Backend Storage
              </h3>
              <p className="text-white/80 mb-4">
                Search history is stored in the backend server&apos;s memory during the session. 
                In a production environment, this would be connected to a database like MongoDB or PostgreSQL.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                💾 Local Storage
              </h3>
              <p className="text-white/80 mb-4">
                As a fallback, search history is also stored in the browser&apos;s localStorage 
                to ensure persistence even when the backend is unavailable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & UX */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Performance & User Experience
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">
              ⚡ Fast Loading
            </h3>
            <p className="text-white/80">
              Optimized API calls with proper error handling and loading states for smooth user experience.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">
              🎨 Modern UI
            </h3>
            <p className="text-white/80">
              Beautiful gradient backgrounds, glassmorphism effects, and responsive design for all devices.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">
              🔄 Error Handling
            </h3>
            <p className="text-white/80">
              Comprehensive error handling with user-friendly messages and fallback options.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">
              📱 Mobile First
            </h3>
            <p className="text-white/80">
              Mobile-first responsive design that works perfectly on all screen sizes.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Check the Weather?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold"
          >
            Get Current Weather
          </button>
          <button
            onClick={() => router.push('/search-history')}
            className="px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-lg transition-colors font-semibold"
          >
            View Search History
          </button>
        </div>
      </div>
    </div>
  );
}
