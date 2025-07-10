import React, { useState, useEffect } from 'react';
import { Heart, FileText, Camera, Gamepad2, Star, Coffee, Music, X,Puzzle } from 'lucide-react';

interface TaskbarProps {
  openApps: string[];
  onAppClick: (appId: string) => void;
  activeApp: string;
  isMobile?: boolean;
  
}

const Taskbar = ({ openApps = [], onAppClick, activeApp, isMobile = false }: TaskbarProps) => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loveMessages = [
    "You make my heart flutter! 💕",
    "Missing you right now... 🥰",
    "Can't wait to see you! ✨",
    "You're my favorite person! 💖",
    "Thinking of our next adventure! 🌟"
  ];

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loveMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
  };

  const getAppInfo = (id: string) => {
    const apps: Record<string, { icon: React.ReactNode; name: string; color: string; bgColor: string }> = {
      'love-counter': { 
        icon: <Heart className="w-4 h-4 fill-current" />, 
        name: 'Love Counter', 
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/90'
      },
      'photo-gallery': { 
        icon: <Camera className="w-4 h-4" />, 
        name: 'Our Memories', 
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/90'
      },
      'love-notes': { 
        icon: <FileText className="w-4 h-4" />, 
        name: 'Love Letters', 
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/90'
      },
      'music-player': { 
        icon: <Music className="w-4 h-4" />, 
        name: 'Our Songs', 
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/90'
      },
      'memory-game': { 
        icon: <Gamepad2 className="w-4 h-4" />, 
        name: 'Memory Match', 
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/90'
      },
      'puzzle-game': { 
        icon: <Puzzle className="w-4 h-4" />, 
        name: 'Love Puzzle', 
        color: 'text-purple-600',
        bgColor: 'bg-purple-600/90'
      },
      'default': { 
        icon: <Heart className="w-4 h-4 fill-current" />, 
        name: 'Love App', 
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/90'
      }
    };
    return apps[id] || apps['default'];
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-16 ${isMobile ? 'px-2' : 'px-6'} bg-gray-900/80 backdrop-blur-lg border-t border-white/10 flex items-center justify-between z-50`}>
      {/* Start Button with Menu */}
      <div className="relative">
        <button 
          onClick={handleStartClick}
          className={`flex items-center gap-2 ${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2'} bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/20`}
        >
          <Heart className="w-4 h-4 fill-current" />
          {!isMobile && <span className="font-medium">Start</span>}
        </button>

        {/* Start Menu */}
        {showStartMenu && (
          <div className={`absolute bottom-full left-0 mb-2 ${isMobile ? 'w-64' : 'w-80'} bg-gray-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-4 transition-all duration-300`}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-pink-100 mb-2">Love OS Dashboard 💕</h3>
              <div className="bg-gradient-to-r from-pink-900/50 to-rose-900/50 rounded-lg p-3 border border-pink-800/30">
                <p className="text-sm text-pink-100 font-medium">{loveMessages[currentMessageIndex]}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/30 rounded-lg p-3 text-center border border-purple-800/30">
                <Coffee className="w-5 h-5 text-purple-300 mx-auto mb-1" />
                <p className="text-xs text-purple-100">Coffee Dates: 47</p>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-3 text-center border border-yellow-800/30">
                <Star className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
                <p className="text-xs text-yellow-100">Cute Moments: ∞</p>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-3 text-center border border-pink-800/30">
                <Music className="w-5 h-5 text-pink-300 mx-auto mb-1" />
                <p className="text-xs text-pink-100">Our Songs: 24</p>
              </div>
              <div className="bg-green-900/30 rounded-lg p-3 text-center border border-green-800/30">
                <Heart className="w-5 h-5 text-green-300 mx-auto mb-1 fill-current" />
                <p className="text-xs text-green-100">Love Level: MAX</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={() => setShowStartMenu(false)}
                className="text-xs text-gray-400 hover:text-pink-200 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Open Apps - Fixed the click issue */}
      <div className={`flex gap-1 ${isMobile ? 'flex-1 overflow-x-auto px-1' : 'flex-1 justify-center'}`}>
        {openApps.map((appId) => {
          const appInfo = getAppInfo(appId);
          const isActive = activeApp === appId;
          
          return (
            <button
              key={appId}
              onClick={() => onAppClick(appId)}
              className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} ${isActive ? appInfo.bgColor : 'bg-white/5 hover:bg-white/10'} rounded-lg transition-all duration-300 border ${isActive ? 'border-white/20' : 'border-transparent'} group min-w-fit`}
              title={appInfo.name}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${appInfo.color} group-hover:scale-110 transition-transform`}>
                {appInfo.icon}
              </div>
              {!isMobile && (
                <span className="text-xs text-gray-100 font-medium">
                  {appInfo.name}
                </span>
              )}
              {isActive && (
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full ml-1"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* System Tray - Dark theme version */}
      <div className="flex items-center gap-3">
        {!isMobile && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-100">{currentTime}</div>
            <div className="text-xs text-gray-300">{currentDate}</div>
          </div>
        )}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;