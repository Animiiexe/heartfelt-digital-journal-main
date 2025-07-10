import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

const PuzzleGame = () => {
  const puzzleImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=360&h=360&fit=crop';
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializePuzzle = () => {
    const newTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    setTiles(newTiles);
    setMoves(0);
    setIsWon(false);
  };

  const shufflePuzzle = () => {
    const shuffled = [...tiles];
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }
    setTiles(shuffled);
    setMoves(0);
    setIsWon(false);
  };

  const getNeighbors = (index: number) => {
    const neighbors = [];
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (row > 0) neighbors.push(index - 3);
    if (row < 2) neighbors.push(index + 3);
    if (col > 0) neighbors.push(index - 1);
    if (col < 2) neighbors.push(index + 1);

    return neighbors;
  };

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const neighbors = getNeighbors(emptyIndex);

    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);
    }
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    const isComplete = tiles.every((tile, index) =>
      index === 8 ? tile === 0 : tile === index + 1
    );
    if (isComplete && moves > 0) {
      setIsWon(true);
    }
  }, [tiles, moves]);

  const getImageStyle = (tileNumber: number) => {
    if (tileNumber === 0) return {};

    const position = tileNumber - 1;
    const row = Math.floor(position / 3);
    const col = position % 3;

    return {
      backgroundImage: `url(${puzzleImage})`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${-col * 100}% ${-row * 100}%`,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 h-full overflow-auto">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Love Puzzle 🧩</h2>
          <div className="flex gap-2">
            <button
              onClick={shufflePuzzle}
              className="flex items-center gap-1 px-4 py-2 bg-purple-300 rounded-lg hover:bg-purple-400 transition"
            >
              <Shuffle className="w-5 h-5" />
              <span className="text-sm">Shuffle</span>
            </button>
            <button
              onClick={initializePuzzle}
              className="flex items-center gap-1 px-4 py-2 bg-pink-300 rounded-lg hover:bg-pink-400 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-3">
          <span className="text-base font-medium text-gray-600">Moves: {moves}</span>
        </div>

        {isWon && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 text-center">
            <p className="text-green-700 font-medium">🎉 Completed in {moves} moves! 🎉</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 w-[360px] h-[360px] mx-auto">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              className={`w-full h-full rounded-lg border-2 transition-transform duration-200 ${
                tile === 0
                  ? 'bg-gray-200 border-gray-300'
                  : 'border-purple-400 hover:scale-105 overflow-hidden'
              }`}
              style={tile !== 0 ? getImageStyle(tile) : {}}
            >
              {tile === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">Empty</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Click tiles next to the empty space to move them
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
