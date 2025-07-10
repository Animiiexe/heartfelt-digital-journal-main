
import React from 'react';
import { Heart, Calendar, Star } from 'lucide-react';

const LoveCounter = () => {
  const startDate = new Date('2024-01-01'); // You can customize this
  const currentDate = new Date();
  const daysTogether = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const milestones = [
    { days: 30, title: 'First Month!', achieved: daysTogether >= 30 },
    { days: 100, title: '100 Days Milestone!', achieved: daysTogether >= 100 },
    { days: 365, title: 'One Year Anniversary!', achieved: daysTogether >= 365 },
    { days: 500, title: '500 Days Strong!', achieved: daysTogether >= 500 },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg overflow-auto">
      <div className="flex-1 flex flex-col items-center justify-start space-y-4 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Time Together</h2>
          <p className="text-sm text-gray-600">Since January 1, 2024</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 w-full max-w-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-500 mb-2">{daysTogether}</div>
            <div className="text-lg text-gray-700 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              days
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-500">{Math.floor(daysTogether / 7)}</div>
            <div className="text-xs text-gray-600">weeks</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-rose-500">{Math.floor(daysTogether / 30)}</div>
            <div className="text-xs text-gray-600">months</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Milestones
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  milestone.achieved 
                    ? 'bg-green-100 border border-green-200' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-xs font-medium truncate flex-1 mr-2">{milestone.title}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-600">{milestone.days}d</span>
                  {milestone.achieved && <Heart className="w-3 h-3 text-red-500 fill-current" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 italic mt-auto">
          "Every day with you is a blessing 💕"
        </div>
      </div>
    </div>
  );
};

export default LoveCounter;
