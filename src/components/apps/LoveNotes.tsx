
import React, { useState } from 'react';
import { Heart, Plus, Edit, Trash2 } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'love-letter' | 'inside-joke' | 'memory' | 'goal';
}

const LoveNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Why I Love You',
      content: 'Your laugh is my favorite sound in the world. The way you scrunch your nose when you smile makes my heart skip a beat every single time. I love how you always know exactly what to say to make me feel better...',
      date: '2024-06-15',
      type: 'love-letter'
    },
    {
      id: 2,
      title: 'Our Pizza Debate',
      content: 'Remember when we spent 3 hours debating whether pineapple belongs on pizza? You were so passionate about it! 😂 Now every time I see a Hawaiian pizza, I think of you.',
      date: '2024-06-10',
      type: 'inside-joke'
    },
    {
      id: 3,
      title: 'That Rainy Day',
      content: 'When we got caught in the rain and had to hide under that tiny coffee shop awning. We were soaked but laughing so hard. That\'s when I knew I wanted to dance in the rain with you forever.',
      date: '2024-05-20',
      type: 'memory'
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', type: 'love-letter' as const });

  const typeColors = {
    'love-letter': 'bg-pink-100 border-pink-300 text-pink-800',
    'inside-joke': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'memory': 'bg-purple-100 border-purple-300 text-purple-800',
    'goal': 'bg-green-100 border-green-300 text-green-800'
  };

  const typeEmojis = {
    'love-letter': '💕',
    'inside-joke': '😂',
    'memory': '✨',
    'goal': '🎯'
  };

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        date: new Date().toISOString().split('T')[0],
        type: newNote.type
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', type: 'love-letter' });
      setIsEditing(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg overflow-hidden flex">
      {/* Notes List */}
      <div className="w-1/3 border-r border-white/30 bg-white/30 backdrop-blur-sm">
        <div className="p-4 border-b border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              Love Notes
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-auto h-full pb-16">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-4 border-b border-white/20 cursor-pointer hover:bg-white/20 transition-colors ${
                selectedNote?.id === note.id ? 'bg-white/30' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[note.type]}`}>
                  {typeEmojis[note.type]} {note.type.replace('-', ' ')}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{note.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
              <p className="text-xs text-gray-500 mt-2">{note.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col">
        {isEditing ? (
          <div className="h-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a New Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newNote.type}
                    onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="love-letter">Love Letter</option>
                    <option value="inside-joke">Inside Joke</option>
                    <option value="memory">Memory</option>
                    <option value="goal">Goal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Give your note a title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={10}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    placeholder="Write your heart out..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addNote}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="h-full p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[selectedNote.type]}`}>
                  {typeEmojis[selectedNote.type]} {selectedNote.type.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500">{selectedNote.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedNote.title}</h3>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-300" />
              <p>Select a note to read, or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveNotes;
