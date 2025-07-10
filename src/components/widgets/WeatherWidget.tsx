import React from 'react';
import { Cloud, Sun, Heart, Droplet } from 'lucide-react';

interface WeatherWidgetProps {
  compact?: boolean;
}

const WeatherWidget = ({ compact = false }: WeatherWidgetProps) => {
  // This would normally fetch from a weather API
  const weather = {
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    location: 'Together ❤️'
  };

  const isCuddleWeather = weather.temperature < 18 || weather.condition === 'Rainy';

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg ${
      compact ? 'p-2 min-w-[150px]' : 'p-4 min-w-[200px]'
    }`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          {weather.condition === 'Sunny' ? (
            <Sun className={compact ? "w-5 h-5 text-yellow-500" : "w-6 h-6 text-yellow-500"} />
          ) : (
            <Cloud className={compact ? "w-5 h-5 text-gray-500" : "w-6 h-6 text-gray-500"} />
          )}
          <span className={compact ? "text-xl font-bold text-gray-800" : "text-2xl font-bold text-gray-800"}>
            {weather.temperature}°C
          </span>
        </div>
        
        {!compact && (
          <>
            <p className="text-sm text-gray-700 mb-1">{weather.condition}</p>
            <p className="text-xs text-gray-600 mb-2">{weather.location}</p>
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