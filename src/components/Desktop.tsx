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
import { motion } from 'framer-motion';

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

  // Check for mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Initialize desktop icons with responsive positions
  useEffect(() => {
    const desktopIcons: DesktopIcon[] = [
      { 
        id: 'love-counter', 
        name: 'Love Counter', 
        icon: Heart, 
        color: 'text-pink-500',
        position: isMobile ? { x: 5, y: 5 } : { x: 5, y: 5 }
      },
      { 
        id: 'photo-gallery', 
        name: 'Our Memories', 
        icon: Camera, 
        color: 'text-purple-500',
        position: isMobile ? { x: 5, y: 25 } : { x: 5, y: 25 }
      },
      { 
        id: 'love-notes', 
        name: 'Love Letters', 
        icon: FileText, 
        color: 'text-rose-500',
        position: isMobile ? { x: 5, y: 45 } : { x: 5, y: 45 }
      },
      { 
        id: 'music-player', 
        name: 'Our Songs', 
        icon: Music, 
        color: 'text-pink-400',
        position: isMobile ? { x: 5, y: 65 } : { x: 20, y: 5 }
      },
      { 
        id: 'memory-game', 
        name: 'Memory Match', 
        icon: Gamepad2, 
        color: 'text-indigo-500',
        position: isMobile ? { x: 5, y: 85 } : { x: 20, y: 25 }
      },
      { 
        id: 'puzzle-game', 
        name: 'Love Puzzle', 
        icon: Puzzle, 
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
    if (isMobile) return; // Disable dragging on mobile
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
      {/* Enhanced Background */}
      <div 
        className="absolute inset-0 desktop-area"
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
        {/* Subtle animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(isMobile ? 12 : 24)].map((_, i) => (
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
                duration: 10 + Math.random() * 10,
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
      </div>

      {/* Desktop Icons - Responsive Layout */}
      <div className="absolute inset-0 p-2 md:p-4 lg:p-8">
        {icons.map((icon) => (
          <motion.button
            key={icon.id}
            onClick={() => openApp(icon.id)}
            onMouseDown={(e) => handleIconDragStart(e, icon.id)}
            className={`absolute flex flex-col items-center gap-1 md:gap-2 p-1 md:p-2 lg:p-3 rounded-lg md:rounded-xl ${
              isMobile ? 'bg-white/20' : 'bg-white/10 backdrop-blur-sm'
            } border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group cursor-default`}
            style={{
              left: `${icon.position?.x}%`,
              top: `${icon.position?.y}%`,
              zIndex: isDraggingIcon === icon.id ? 100 : 1,
              transform: isDraggingIcon === icon.id ? 'scale(1.1)' : undefined,
              boxShadow: isDraggingIcon === icon.id ? '0 0 15px rgba(255, 255, 255, 0.5)' : undefined,
              width: isMobile ? '90%' : 'auto',
              maxWidth: isMobile ? '150px' : 'none'
            }}
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 0.95 : isDraggingIcon === icon.id ? 1.1 : 0.95 }}
          >
            <icon.icon className={`w-4 h-4 md:w-6 md:h-6 ${icon.color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-medium text-gray-200 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {icon.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Weather Widget - Responsive Positioning */}
      <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-8 right-8'}`}>
        <WeatherWidget compact={isMobile} />
      </div>

      {/* Windows - Responsive Sizing */}
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

      <Taskbar 
        openApps={openWindows} 
        onAppClick={setActiveWindow}
        activeApp={activeWindow}
        isMobile={isMobile}
      />

      {/* Date/Time Display - Responsive Positioning */}
      <div className={`absolute ${
        isMobile ? 'bottom-20 left-1/2 transform -translate-x-1/2' : 'bottom-24 left-1/2 transform -translate-x-1/2'
      } bg-black/40 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-gray-100 border border-white/20`}>
        {new Date().toLocaleString('en-US', {
          weekday: isMobile ? 'short' : 'long',
          month: isMobile ? 'short' : 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>

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