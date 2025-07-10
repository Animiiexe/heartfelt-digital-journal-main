import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, Shuffle, Repeat, Music } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  isOurSong: boolean;
  audioSrc: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlist: Song[] = [
    {
      id: 1,
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: '4:23',
      cover: 'https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: true,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 2,
      title: 'All of Me',
      artist: 'John Legend',
      album: 'Love in the Future',
      duration: '4:29',
      cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: true,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 3,
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      album: 'x (Multiply)',
      duration: '4:41',
      cover: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: false,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: 4,
      title: 'Make You Feel My Love',
      artist: 'Adele',
      album: '19',
      duration: '3:32',
      cover: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: true,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
      id: 5,
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      duration: '4:45',
      cover: 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: false,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
      id: 6,
      title: 'Stay With Me',
      artist: 'Sam Smith',
      album: 'In the Lonely Hour',
      duration: '2:52',
      cover: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: true,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    {
      id: 7,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: '3:53',
      cover: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: false,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    },
    {
      id: 8,
      title: 'Hello',
      artist: 'Adele',
      album: '25',
      duration: '4:55',
      cover: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOurSong: true,
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    }
  ];

  const currentTrack = playlist[currentSong];

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle next song
  const nextSong = () => {
    if (isShuffleOn) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentSong(nextIndex);
    } else {
      setCurrentSong((prev) => (prev + 1) % playlist.length);
    }
  };

  // Handle previous song
  const prevSong = () => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);
      }
    } else {
      setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const percentageClicked = clickPosition / progressBarWidth;
    
    if (audioRef.current) {
      audioRef.current.currentTime = percentageClicked * duration;
    }
  };

  // Effect to handle song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioSrc;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // Effect to update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeatOn) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isRepeatOn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-100 to-stone-200 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto h-full ">
        {/* Hidden audio element */}
        <audio ref={audioRef} />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-stone-600" />
            <h1 className="text-2xl font-bold text-stone-800">Our Songs</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-stone-500">
            <span>{playlist.length} songs</span>
            <span>•</span>
            <span>{playlist.filter(song => song.isOurSong).length} favorites</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 h-full ">
          {/* Main Player - Left Side */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl border border-stone-200/50 rounded-3xl shadow-2xl shadow-stone-300/20 p-8 sticky top-8">
              {/* Album Art */}
              <div className="relative mb-8">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.album}
                  className="w-full aspect-square rounded-2xl shadow-lg object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Song Info */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-stone-800 truncate">{currentTrack.title}</h2>
                  {currentTrack.isOurSong && (
                    <Heart className="w-5 h-5 text-rose-400 fill-current flex-shrink-0" />
                  )}
                </div>
                <p className="text-stone-500 text-base truncate mb-1">{currentTrack.artist}</p>
                <p className="text-stone-400 text-sm truncate">{currentTrack.album}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div 
                  className="h-2 bg-stone-200 rounded-full cursor-pointer mb-3 overflow-hidden"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-stone-600 to-stone-700 rounded-full transition-all duration-100 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-stone-700 rounded-full shadow-sm opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-stone-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <button 
                    onClick={() => setIsShuffleOn(!isShuffleOn)}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isShuffleOn 
                        ? 'text-stone-700 bg-stone-100' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={prevSong}
                    className="p-3 text-stone-500 hover:text-stone-700 transition-colors duration-200"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="bg-stone-800 hover:bg-stone-900 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg p-2"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                  
                  <button
                    onClick={nextSong}
                    className="p-3 text-stone-500 hover:text-stone-700 transition-colors duration-200"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  
                  <button 
                    onClick={() => setIsRepeatOn(!isRepeatOn)}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isRepeatOn 
                        ? 'text-stone-700 bg-stone-100' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-center gap-4">
                  <Volume2 className="w-5 h-5 text-stone-400" />
                  <div className="flex-1 max-w-32">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-600 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white/60 backdrop-blur-xl border border-stone-200/50 rounded-3xl shadow-xl shadow-stone-300/10 overflow-hidden ">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-stone-700">Playlist</h3>
                  <div className="text-sm text-stone-500 ">
                    {playlist.length} songs
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide">
                  {playlist.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => {
                        setCurrentSong(index);
                        if (!isPlaying) setIsPlaying(true);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
                        index === currentSong 
                          ? 'bg-white shadow-md border border-stone-200' 
                          : 'hover:bg-white/70'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img 
                          src={song.cover} 
                          alt={song.album}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        {index === currentSong && (
                          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-white" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium truncate ${
                            index === currentSong ? 'text-stone-800' : 'text-stone-700'
                          }`}>
                            {song.title}
                          </p>
                          {song.isOurSong && (
                            <Heart className="w-4 h-4 text-rose-400 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-stone-500 text-sm truncate">{song.artist}</p>
                        <p className="text-stone-400 text-xs truncate">{song.album}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {index === currentSong && (
                          <div className="text-xs text-stone-500">
                            {formatTime(currentTime)} / {song.duration}
                          </div>
                        )}
                        {index !== currentSong && (
                          <span className="text-sm text-stone-400">{song.duration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer

