import { useState, useEffect } from 'react';
import { Color, GameState, WebSocketMessage } from './types';
import { initialGameState } from './constants';
import { getValidRemovalPieces } from './gameUtils';

interface UseGameSocketReturn {
  ws: WebSocket | null;
  gameState: GameState;
  playerColor: Color;
  selected: string | null;
  validMoves: string[];
  status: string;
  setStatus: (status: string) => void;
  removalMode: boolean;
  removalValid: string[];
  millHighlight: string[];
  setSelected: (pos: string | null) => void;
  setValidMoves: (moves: string[]) => void;
  handleRestart: () => void;
}

export function useGameSocket(): UseGameSocketReturn {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerColor, setPlayerColor] = useState<Color>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [removalMode, setRemovalMode] = useState(false);
  const [removalValid, setRemovalValid] = useState<string[]>([]);
  const [millHighlight, setMillHighlight] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3005');
    
    socket.onopen = () => setStatus('Connected to server');
    
    socket.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      if (data.type === 'welcome' && data.color) {
        setPlayerColor(data.color);
      }
      
      if (['start', 'place', 'move', 'remove', 'restart'].includes(data.type) && data.success && data.state) {
        setGameState(data.state);
        setSelected(null);
        setValidMoves([]);
        setStatus(data.message || '');
        setRemovalMode(data.canRemove || false);
        
        if (data.canRemove && data.state) {
          const validPieces = getValidRemovalPieces(data.state, data.mill || []);
          setRemovalValid(validPieces);
          setStatus('Remove an opponent piece');
        } else {
          setRemovalValid([]);
        }
        
        setMillHighlight(data.mill || []);
        setTimeout(() => setMillHighlight([]), 1200);
      } else if (data.type === 'remove' && !data.success) {
        setStatus(data.message || 'Invalid removal - try another piece');
      } else if (data.message) {
        setStatus(data.message);
      }
    };
    
    socket.onerror = () => setStatus('WebSocket error');
    setWs(socket);
    
    return () => socket.close();
  }, []);

  const handleRestart = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'restart' }));
      setSelected(null);
      setValidMoves([]);
      setRemovalMode(false);
      setRemovalValid([]);
      setMillHighlight([]);
    }
  };

  return {
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
  };
} 