'use client'
import React from 'react';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { useGameSocket } from '../lib/useGameSocket';
import { getValidMovesFor } from '../lib/gameUtils';

export default function MorrisBoard() {
  const {
    ws,
    gameState,
    playerColor,
    selected,
    validMoves,
    status,
    setStatus,
    removalMode,
    removalValid,
    millHighlight,
    setSelected,
    setValidMoves,
    handleRestart,
  } = useGameSocket();

  function handleIntersectionClick(id: string) {
    if (!ws || !playerColor || gameState.winner) return;
    
    if (removalMode) {
      const opponentColor = gameState.currentPlayer === 'white' ? 'black' : 'white';
      if (gameState.board[id] === opponentColor) {
        ws.send(JSON.stringify({ type: 'remove', position: id }));
      } else {
        setStatus("You can only remove opponent pieces!");
      }
      return;
    }

    if (gameState.currentPlayer !== playerColor) {
      setStatus("Not your turn!");
      return;
    }

    if (gameState.gamePhase === 'PLACING') {
      if (!gameState.board[id] && gameState.remainingPieces[playerColor] > 0) {
        ws.send(JSON.stringify({ type: 'place', position: id }));
      }
    } else if (gameState.gamePhase === 'MOVING' || gameState.gamePhase === 'FLYING') {
      if (selected) {
        if (validMoves.includes(id)) {
          ws.send(JSON.stringify({ type: 'move', from: selected, to: id }));
          setSelected(null);
          setValidMoves([]);
        } else if (gameState.board[id] === playerColor) {
          setSelected(id);
          setValidMoves(getValidMovesFor(id, gameState, playerColor));
        } else {
          setSelected(null);
          setValidMoves([]);
        }
      } else if (gameState.board[id] === playerColor) {
        setSelected(id);
        setValidMoves(getValidMovesFor(id, gameState, playerColor));
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black w-screen h-screen">
      <div className="max-w-xs w-full bg-gray-900 rounded-xl p-1 shadow-xl flex flex-col justify-between max-h-[85vh] overflow-y-auto">
        <GameBoard
          board={gameState.board}
          selected={selected}
          validMoves={validMoves}
          millHighlight={millHighlight}
          removalMode={removalMode}
          removalValid={removalValid}
          onIntersectionClick={handleIntersectionClick}
        />
        <GameStatus
          gameState={gameState}
          playerColor={playerColor}
          status={status}
          removalMode={removalMode}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
