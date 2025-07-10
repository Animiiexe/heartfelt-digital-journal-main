
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const MemoryGame = () => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop'
  ];

  const [cards, setCards] = useState<{ id: number; imageUrl: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const gameCards = [];
    for (let i = 0; i < imageUrls.length; i++) {
      gameCards.push(
        { id: i * 2, imageUrl: imageUrls[i], isFlipped: false, isMatched: false },
        { id: i * 2 + 1, imageUrl: imageUrls[i], isFlipped: false, isMatched: false }
      );
    }
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].imageUrl === cards[second].imageUrl) {
        setCards(prev => prev.map((card, index) => 
          index === first || index === second 
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        
        if (matches + 1 === imageUrls.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matches, imageUrls.length]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
    setMoves(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 to-rose-50 p-4 overflow-auto m-2 scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Memory Match 💕</h2>
        <button
          onClick={initializeGame}
          className="flex items-center gap-1 px-3 py-1 bg-pink-200 rounded-lg hover:bg-pink-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">New Game</span>
        </button>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>Moves: {moves}</span>
        <span>Matches: {matches}/{imageUrls.length}</span>
      </div>

      {gameWon && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 text-center">
          <p className="text-green-700 font-medium">🎉 You won in {moves} moves! 🎉</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 flex-1">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-lg border-2 overflow-hidden transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'border-pink-300 scale-105'
                : 'bg-gradient-to-br from-pink-200 to-rose-200 border-pink-400 hover:scale-105'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <img 
                src={card.imageUrl} 
                alt="Memory card" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
                <span className="text-2xl">💕</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
