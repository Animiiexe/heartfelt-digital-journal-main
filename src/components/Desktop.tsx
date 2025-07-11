import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Camera, Music, FileText, Cloud, Settings, Sparkles, Gamepad2, Puzzle } from 'lucide-react';
import Window from './Window';
import LoveCounter from './apps/LoveCounter';
import PhotoGallery from './apps/PhotoGallery';
import LoveNotes from './apps/LoveNotes';
import MusicPlayer from './apps/MusicPlayer';
import MemoryGame from './apps/MemoryGame';
import PuzzleGame from './apps/PuzzleGame';
import WeatherWidget from './widgets/WeatherWidget';
import Taskbar from './Taskbar';
import { motion, AnimatePresence } from 'framer-motion';

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position?: { x: number; y: number };
}

const Desktop = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string>('');
  const [icons, setIcons] = useState<DesktopIcon[]>([]);
  const [isDraggingIcon, setIsDraggingIcon] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check for mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize desktop icons with responsive positions
  
    
useEffect(() => {
  const desktopIcons: DesktopIcon[] = [
    { 
      id: 'love-counter', 
      name: 'Love Counter', 
      icon: () => (
        <img 
          src="https://thumbs.dreamstime.com/z/ball-chain-29561616.jpg" 
          alt="Love Counter" 
          className="w-full h-full object-contain"
        />
      ),
      color: 'text-pink-500',
      position: isMobile ? { x: 5, y: 5 } : { x: 5, y: 5 }
    },
    { 
      id: 'photo-gallery', 
      name: 'Our Memories', 
      icon: () => (
        <img 
          src="/icons/memories.png" 
          alt="Our Memories" 
          className="w-6 h-6 object-contain rounded-full border border-white/30"
        />
      ),
      color: 'text-purple-500',
      position: isMobile ? { x: 5, y: 25 } : { x: 5, y: 25 }
    },
    { 
      id: 'love-notes', 
      name: 'Love Letters', 
      icon: () => (
        <img 
          src="/icons/love-letters.png" 
          alt="Love Letters" 
          className="w-6 h-6 object-contain"
        />
      ),
      color: 'text-rose-500',
      position: isMobile ? { x: 5, y: 45 } : { x: 5, y: 45 }
    },
    { 
      id: 'music-player', 
      name: 'Our Songs', 
      icon: () => (
        <img 
          src="/icons/music.png" 
          alt="Our Songs" 
          className="w-6 h-6 object-contain rounded-full"
        />
      ),
      color: 'text-pink-400',
      position: isMobile ? { x: 5, y: 65 } : { x: 20, y: 5 }
    },
    { 
      id: 'memory-game', 
      name: 'Memory Match', 
      icon: () => (
        <img 
          src="/icons/memory-game.png" 
          alt="Memory Game" 
          className="w-6 h-6 object-contain"
        />
      ),
      color: 'text-indigo-500',
      position: isMobile ? { x: 5, y: 85 } : { x: 20, y: 25 }
    },
    { 
      id: 'puzzle-game', 
      name: 'Love Puzzle', 
      icon: () => (
        <img 
          src="/icons/puzzle.png" 
          alt="Love Puzzle" 
          className="w-6 h-6 object-contain"
        />
      ),
      color: 'text-purple-600',
      position: isMobile ? { x: 5, y: 105 } : { x: 20, y: 45 }
    },
  ];
  
  setIcons(desktopIcons);
}, [isMobile]);

  const openApp = (appId: string) => {
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
    }
    setActiveWindow(appId);
  };

  const closeApp = (appId: string) => {
    setOpenWindows(openWindows.filter(id => id !== appId));
    if (activeWindow === appId) {
      setActiveWindow(openWindows[openWindows.length - 2] || '');
    }
  };

  const handleIconDragStart = (e: React.MouseEvent, iconId: string) => {
    if (isMobile) return;
    setIsDraggingIcon(iconId);
    e.preventDefault();
  };

  const handleIconDrag = (e: React.MouseEvent) => {
    if (!isDraggingIcon || isMobile) return;
    
    const desktopRect = document.querySelector('.desktop-area')?.getBoundingClientRect();
    if (!desktopRect) return;

    const x = ((e.clientX - desktopRect.left) / desktopRect.width) * 100;
    const y = ((e.clientY - desktopRect.top) / desktopRect.height) * 100;

    setIcons(prevIcons => 
      prevIcons.map(icon => 
        icon.id === isDraggingIcon 
          ? { ...icon, position: { x, y } } 
          : icon
      )
    );
  };

  const handleIconDragEnd = () => {
    setIsDraggingIcon(null);
  };

  const renderApp = (appId: string) => {
    switch (appId) {
      case 'love-counter':
        return <LoveCounter />;
      case 'photo-gallery':
        return <PhotoGallery />;
      case 'love-notes':
        return <LoveNotes />;
      case 'music-player':
        return <MusicPlayer />;
      case 'memory-game':
        return <MemoryGame />;
      case 'puzzle-game':
        return <PuzzleGame />;
      default:
        return <div>App not found</div>;
    }
  };

  return (
    <div 
      className={`h-screen w-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900`}
      onMouseMove={handleIconDrag}
      onMouseUp={handleIconDragEnd}
      onMouseLeave={handleIconDragEnd}
    >
      {/* Enhanced Background with subtle animation */}
      <motion.div 
        className="absolute inset-0 desktop-area"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 180, 203, 0.15) 0%, transparent 25%),
            radial-gradient(circle at 80% 70%, rgba(199, 146, 234, 0.15) 0%, transparent 25%),
            linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(88, 28, 135, 0.9))
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        {/* Animated floating hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(isMobile ? 10 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: Math.random() * 360
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.2, 0.8],
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 10
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Heart className={`w-3 h-3 ${Math.random() > 0.5 ? 'text-pink-300' : 'text-purple-300'} fill-current`} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Desktop Icons - Responsive Layout */}
     <div className="absolute inset-0 p-2 md:p-4 lg:p-8">
  {icons.map((icon) => (
    <motion.div
      key={icon.id}
      onClick={() => openApp(icon.id)}
      onMouseDown={(e) => handleIconDragStart(e, icon.id)}
      className={`absolute flex flex-col items-center gap-1 p-1 cursor-default`}
      style={{
        left: `${icon.position?.x}%`,
        top: `${icon.position?.y}%`,
        zIndex: isDraggingIcon === icon.id ? 100 : 1,
      }}
      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
      whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
    >
      {/* Windows-style icon container */}
      <div className={`flex flex-col items-center p-2 rounded-md ${
        isDraggingIcon === icon.id ? 'bg-blue-500/20' : 'hover:bg-white/20'
      } transition-colors duration-200`}>
        {/* Icon image with Windows-style sizing */}
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-1">
          {typeof icon.icon === 'function' ? (
            <icon.icon className="w-full h-full object-contain" />
          ) : (
            <icon.icon className={`w-full h-full ${icon.color}`} />
          )}
        </div>
        
        {/* Windows-style text label */}
        <span className="text-xs text-white text-center px-1 py-0.5 rounded bg-black/40 backdrop-blur-sm max-w-[80px] truncate">
          {icon.name}
        </span>
      </div>
      
      {/* Selection indicator (similar to Windows) */}
      {isDraggingIcon === icon.id && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-md pointer-events-none" />
      )}
    </motion.div>
  ))}
</div>

      {/* Weather Widget - Responsive Positioning */}
      <motion.div 
        className={`absolute ${isMobile ? 'top-4 right-4' : 'top-8 right-8'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <WeatherWidget compact={isMobile} location={{ lat: 19.0760, lon: 72.8777 }} />
      </motion.div>

      {/* Windows - With AnimatePresence for smooth exit animations */}
      <AnimatePresence>
        {openWindows.map((appId) => {
          const icon = icons.find(i => i.id === appId);
          return (
            <Window
              key={appId}
              title={icon?.name || 'App'}
              isActive={activeWindow === appId}
              onClose={() => closeApp(appId)}
              onFocus={() => setActiveWindow(appId)}
              defaultSize={isMobile ? { width: 350, height: 500 } : { width: 700, height: 550 }}
              defaultPosition={
                isMobile 
                  ? { x: 10, y: 10 }
                  : {
                      x: Math.floor(Math.random() * 200) + 100,
                      y: Math.floor(Math.random() * 100) + 50
                    }
              }
              isMobile={isMobile}
            >
              {renderApp(appId)}
            </Window>
          );
        })}
      </AnimatePresence>

      <Taskbar 
        openApps={openWindows} 
        onAppClick={setActiveWindow}
        activeApp={activeWindow}
        isMobile={isMobile}
      />

      {/* Enhanced Date/Time Display */}
     <motion.div 
  className={`absolute ${
    isMobile ? 'bottom-20' : 'bottom-24'
  } left-0 right-0 mx-auto bg-black/40 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-gray-100 border border-white/20 flex items-center justify-center gap-2 w-fit`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
>
  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
  <span>
    {currentTime.toLocaleString('en-US', {
      weekday: isMobile ? 'short' : 'long',
      month: isMobile ? 'short' : 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </span>
</motion.div>

      {/* Floating Effects - Reduced on Mobile */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.2, 0.8]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 3
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Desktop;