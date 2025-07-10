
import React, { useState } from 'react';
import { Heart, Plus, Search } from 'lucide-react';

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Sample photos - in a real app, these would come from your storage
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1518057111178-9a930acb8bb0?w=400',
      title: 'Our First Date',
      date: '2024-01-15',
      description: 'That magical evening when it all began ✨'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
      title: 'Beach Day',
      date: '2024-02-20',
      description: 'Sun, sand, and endless laughter 🏖️'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      title: 'Cozy Night In',
      date: '2024-03-10',
      description: 'Movie night with homemade popcorn 🍿'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=400',
      title: 'Adventure Hike',
      date: '2024-04-05',
      description: 'Conquering mountains together 🏔️'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      title: 'Dinner Date',
      date: '2024-05-12',
      description: 'Fancy dinner for our 4-month anniversary 🍝'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      title: 'Weekend Getaway',
      date: '2024-06-01',
      description: 'Exploring new places hand in hand 💕'
    }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden flex flex-col">
      {selectedPhoto ? (
        // Photo viewer
        <div className="h-full flex flex-col">
          <div className="p-3 bg-white/70 backdrop-blur-sm border-b border-white/30 flex-shrink-0">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              ← Back to Gallery
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div className="max-w-sm w-full">
              <img
                src={selectedPhoto}
                alt="Selected photo"
                className="w-full h-48 object-cover rounded-lg shadow-lg mb-3"
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                {photos.find(p => p.url === selectedPhoto) && (
                  <>
                    <h3 className="font-semibold text-gray-800 text-base mb-1">
                      {photos.find(p => p.url === selectedPhoto)?.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {photos.find(p => p.url === selectedPhoto)?.date}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {photos.find(p => p.url === selectedPhoto)?.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Gallery grid
        <div className="h-full flex flex-col">
          <div className="p-3 bg-white/70 backdrop-blur-sm border-b border-white/30 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 fill-current" />
                Our Memories
              </h2>
              <button className="bg-pink-500 text-white px-2 py-1 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-1 text-xs">
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                className="w-full pl-7 pr-3 py-1.5 bg-white/60 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-24 object-cover group-hover:brightness-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-1 left-1 text-white">
                        <p className="text-xs font-medium truncate">{photo.title}</p>
                        <p className="text-xs opacity-80">{photo.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
