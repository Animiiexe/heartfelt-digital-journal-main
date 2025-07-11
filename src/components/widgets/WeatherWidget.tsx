import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Heart, Droplet } from 'lucide-react';

interface WeatherWidgetProps {
  compact?: boolean;
  location?: {
    lat: number;
    lon: number;
  };
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

const WeatherWidget = ({ compact = false, location }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    location: 'Together ❤️'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // If no specific location is provided, use the default "Together" display
        if (!location) {
          setLoading(false);
          return;
        }

        // Using OpenWeatherMap API as an example - you'll need an API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          location: data.name
        });
      } catch (err) {
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading && location) {
    return (
      <div className={`bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg ${
        compact ? 'p-2 min-w-[150px]' : 'p-4 min-w-[200px]'
      }`}>
        <div className="text-center">Loading weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg ${
        compact ? 'p-2 min-w-[150px]' : 'p-4 min-w-[200px]'
      }`}>
        <div className="text-center text-red-500">Weather unavailable</div>
      </div>
    );
  }

  const isCuddleWeather = weather.temperature < 18 || weather.condition === 'Rain';

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl ${
      compact ? 'p-2 min-w-[150px]' : 'p-4 min-w-[200px]'
    }`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          {weather.condition === 'Clear' ? (
            <Sun className={compact ? "w-5 h-5 text-yellow-500" : "w-6 h-6 text-yellow-500"} />
          ) : (
            <Cloud className={compact ? "w-5 h-5 text-gray-500" : "w-6 h-6 text-gray-500"} />
          )}
          <span className={compact ? "text-xl font-bold text-white" : "text-2xl font-bold text-white"}>
            {weather.temperature}°C
          </span>
        </div>
        
        {!compact && (
          <>
            <p className="text-sm text-white mb-1">{weather.condition}</p>
            <p className="text-xs text-white mb-2">{weather.location}</p>
          </>
        )}
        
        {isCuddleWeather ? (
          <div className={`${compact ? 'p-1' : 'p-2'} bg-pink-100 border border-pink-200 rounded-lg text-center`}>
            <Heart className={compact ? "w-3 h-3 text-pink-500 mx-auto" : "w-4 h-4 text-pink-500 mx-auto mb-1"} />
            {!compact && <p className="text-xs text-pink-700 font-medium">Perfect cuddle weather! 🥰</p>}
          </div>
        ) : (
          <div className={`${compact ? 'p-1' : 'p-2'} bg-yellow-100 border border-yellow-200 rounded-lg text-center`}>
            <Sun className={compact ? "w-3 h-3 text-yellow-500 mx-auto" : "w-4 h-4 text-yellow-500 mx-auto mb-1"} />
            {!compact && <p className="text-xs text-yellow-700 font-medium">Great day for an adventure! ☀️</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;