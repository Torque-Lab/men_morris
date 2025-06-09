import React from 'react';
import { Color, GameState } from '../lib/types';
import { getGameStatus } from '../lib/gameUtils';

interface GameStatusProps {
  gameState: GameState;
  playerColor: Color;
  status: string;
  removalMode: boolean;
  onRestart: () => void;
}

export function GameStatus({
  gameState,
  playerColor,
  status,
  removalMode,
  onRestart,
}: GameStatusProps) {
  return (
    <div className="flex flex-col items-center mt-auto mb-1">
      <h2 className="text-white text-sm mb-0.5 text-center">
        {getGameStatus(gameState, removalMode)}
      </h2>
      <div className="flex justify-center gap-1 mb-0.5">
        <div className="text-white text-xs">White: {gameState.remainingPieces.white}</div>
        <div className="text-black bg-white rounded px-0.5 text-xs">Black: {gameState.remainingPieces.black}</div>
      </div>
      <div className="text-white text-center text-xs mb-0.5">
        Current turn: <span className={gameState.currentPlayer === 'white' ? 'text-white' : 'text-black bg-white px-0.5 rounded'}>{gameState.currentPlayer}</span>
      </div>
      <div className="text-yellow-300 text-center text-xs mb-0.5">{status}</div>
      <div className="text-gray-400 text-xs text-center mb-1">You are: {playerColor}</div>
      {gameState.winner && (
        <button
          onClick={onRestart}
          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors mt-0.5"
        >
          Play Again
        </button>
      )}
    </div>
  );
} 