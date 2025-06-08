'use client'
import React, { useEffect, useState } from 'react';

// --- Board Data ---
const POSITIONS = [
  { id: 'a1', x: 10, y: 10, adj: ['d1', 'a4'] },
  { id: 'd1', x: 50, y: 10, adj: ['a1', 'g1', 'd2'] },
  { id: 'g1', x: 90, y: 10, adj: ['d1', 'g4'] },
  { id: 'b2', x: 20, y: 20, adj: ['d2', 'b4'] },
  { id: 'd2', x: 50, y: 20, adj: ['b2', 'f2', 'd1', 'd3'] },
  { id: 'f2', x: 80, y: 20, adj: ['d2', 'f4'] },
  { id: 'c3', x: 30, y: 30, adj: ['d3', 'c4'] },
  { id: 'd3', x: 50, y: 30, adj: ['c3', 'e3', 'd2'] },
  { id: 'e3', x: 70, y: 30, adj: ['d3', 'e4'] },
  { id: 'a4', x: 10, y: 50, adj: ['a1', 'a7', 'b4'] },
  { id: 'b4', x: 20, y: 50, adj: ['a4', 'b2', 'c4', 'b6'] },
  { id: 'c4', x: 30, y: 50, adj: ['b4', 'c3', 'c5'] },
  { id: 'e4', x: 70, y: 50, adj: ['e3', 'e5', 'f4'] },
  { id: 'f4', x: 80, y: 50, adj: ['e4', 'f2', 'f6', 'g4'] },
  { id: 'g4', x: 90, y: 50, adj: ['g1', 'g7', 'f4'] },
  { id: 'c5', x: 30, y: 70, adj: ['c4', 'd5'] },
  { id: 'd5', x: 50, y: 70, adj: ['c5', 'e5', 'd6'] },
  { id: 'e5', x: 70, y: 70, adj: ['d5', 'e4'] },
  { id: 'b6', x: 20, y: 80, adj: ['b4', 'd6'] },
  { id: 'd6', x: 50, y: 80, adj: ['b6', 'f6', 'd5', 'd7'] },
  { id: 'f6', x: 80, y: 80, adj: ['d6', 'f4'] },
  { id: 'a7', x: 10, y: 90, adj: ['a4', 'd7'] },
  { id: 'd7', x: 50, y: 90, adj: ['a7', 'g7', 'd6'] },
  { id: 'g7', x: 90, y: 90, adj: ['d7', 'g4'] },
];

const initialBoard = Object.fromEntries(POSITIONS.map(p => [p.id, null]));

// --- Types ---
type Color = 'white' | 'black' | null;
type Phase = 'PLACING' | 'MOVING' | 'FLYING';

interface GameState {
  board: Record<string, Color>;
  currentPlayer: Color;
  gamePhase: Phase;
  winner: Color | null;
  remainingPieces: { white: number; black: number };
}

export default function MorrisBoard() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    board: { ...initialBoard },
    currentPlayer: 'white',
    gamePhase: 'PLACING',
    winner: null,
    remainingPieces: { white: 9, black: 9 },
  });
  const [playerColor, setPlayerColor] = useState<Color>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [removalMode, setRemovalMode] = useState(false);
  const [removalValid, setRemovalValid] = useState<string[]>([]);
  const [millHighlight, setMillHighlight] = useState<string[]>([]);

  // --- WebSocket Setup ---
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3005');
    socket.onopen = () => setStatus('Connected to server');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'welcome') setPlayerColor(data.color);
      if (['start', 'place', 'move'].includes(data.type) && data.success) {
        setGameState(data.state);
        setSelected(null);
        setValidMoves([]);
        setStatus(data.message || '');
        setRemovalMode(false);
        setRemovalValid([]);
        setMillHighlight(data.mill || []);
        setTimeout(() => setMillHighlight([]), 1200);
      } else if (data.type === 'remove' && data.valid) {
        setRemovalMode(true);
        setRemovalValid(data.valid);
        setStatus('Remove an opponent piece');
        setMillHighlight(data.mill || []);
        setTimeout(() => setMillHighlight([]), 1200);
      } else if (data.message) {
        setStatus(data.message);
      }
    };
    socket.onerror = () => setStatus('WebSocket error');
    setWs(socket);
    return () => socket.close();
  }, []);

  // --- Move Calculation ---
  function getValidMovesFor(pos: string): string[] {
    if (!playerColor) return [];
    if (gameState.gamePhase === 'FLYING') {
      return POSITIONS.filter(p => !gameState.board[p.id]).map(p => p.id);
    }
    const found = POSITIONS.find(p => p.id === pos);
    return found ? found.adj.filter(adj => !gameState.board[adj]) : [];
  }

  // --- Click Handler ---
  function handleIntersectionClick(id: string) {
    if (!ws || !playerColor || gameState.winner) return;
    if (removalMode) {
      if (removalValid.includes(id)) {
        ws.send(JSON.stringify({ type: 'remove', position: id }));
        setRemovalMode(false);
        setRemovalValid([]);
      }
      return;
    }
    if (gameState.currentPlayer !== playerColor) return setStatus("Not your turn!");

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
          setValidMoves(getValidMovesFor(id));
        } else {
          setSelected(null);
          setValidMoves([]);
        }
      } else if (gameState.board[id] === playerColor) {
        setSelected(id);
        setValidMoves(getValidMovesFor(id));
      }
    }
  }

  // --- Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h2 className="text-white text-2xl mb-4">
        {gameState.gamePhase === 'PLACING'
          ? 'SET YOUR MEN ON THE BOARD'
          : gameState.winner
          ? `WINNER: ${gameState.winner.toUpperCase()}`
          : removalMode
          ? 'REMOVE AN OPPONENT PIECE'
          : 'MOVE YOUR MEN'}
      </h2>
      <svg viewBox="0 0 100 100" className="w-full max-w-[400px] h-auto mx-auto" style={{ background: '#e0c080', borderRadius: 16, boxShadow: '0 0 16px #0008' }}>
        {/* Board lines */}
        <rect x="10" y="10" width="80" height="80" stroke="#222" strokeWidth="2" fill="none" />
        <rect x="20" y="20" width="60" height="60" stroke="#222" strokeWidth="2" fill="none" />
        <rect x="30" y="30" width="40" height="40" stroke="#222" strokeWidth="2" fill="none" />
        <line x1="50" y1="10" x2="50" y2="30" stroke="#222" strokeWidth="2" />
        <line x1="50" y1="70" x2="50" y2="90" stroke="#222" strokeWidth="2" />
        <line x1="10" y1="50" x2="30" y2="50" stroke="#222" strokeWidth="2" />
        <line x1="70" y1="50" x2="90" y2="50" stroke="#222" strokeWidth="2" />
        {/* Intersections */}
        {POSITIONS.map(pos => (
          <g key={pos.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={4}
              fill={
                removalMode && removalValid.includes(pos.id)
                  ? '#f00'
                  : millHighlight.includes(pos.id)
                  ? '#0ff'
                  : gameState.board[pos.id] === 'white'
                  ? '#fff'
                  : gameState.board[pos.id] === 'black'
                  ? '#222'
                  : '#b3e5fc'
              }
              stroke={
                removalMode && removalValid.includes(pos.id)
                  ? '#f00'
                  : millHighlight.includes(pos.id)
                  ? '#0ff'
                  : selected === pos.id
                  ? '#ff0'
                  : validMoves.includes(pos.id)
                  ? '#0f0'
                  : '#333'
              }
              strokeWidth={
                removalMode && removalValid.includes(pos.id)
                  ? 3
                  : millHighlight.includes(pos.id)
                  ? 3
                  : selected === pos.id
                  ? 2
                  : 1
              }
              style={{
                filter:
                  removalMode && removalValid.includes(pos.id)
                    ? 'drop-shadow(0 0 8px #f00)'
                    : millHighlight.includes(pos.id)
                    ? 'drop-shadow(0 0 8px #0ff)'
                    : selected === pos.id || validMoves.includes(pos.id)
                    ? 'drop-shadow(0 0 6px #0f0)'
                    : undefined,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleIntersectionClick(pos.id)}
            />
          </g>
        ))}
      </svg>
      <div className="flex gap-8 mt-4">
        <div className="text-white">White: {gameState.remainingPieces.white}</div>
        <div className="text-black bg-white rounded px-2">Black: {gameState.remainingPieces.black}</div>
      </div>
      <div className="mt-2 text-white">
        Current turn: <span className={gameState.currentPlayer === 'white' ? 'text-white' : 'text-black bg-white px-1 rounded'}>{gameState.currentPlayer}</span>
      </div>
      <div className="mt-2 text-yellow-300">{status}</div>
      <div className="mt-2 text-gray-400 text-xs">You are: {playerColor}</div>
    </div>
  );
}
