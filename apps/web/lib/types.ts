export type Color = 'white' | 'black' | null;
export type Phase = 'PLACING' | 'MOVING' | 'FLYING';

export interface Position {
  id: string;
  x: number;
  y: number;
  adj: string[];
}

export interface GameState {
  board: Record<string, Color>;
  currentPlayer: Color;
  gamePhase: Phase;
  winner: Color | null;
  remainingPieces: { white: number; black: number };
}

export interface WebSocketMessage {
  type: 'welcome' | 'start' | 'place' | 'move' | 'remove' | 'restart';
  color?: Color;
  state?: GameState;
  success?: boolean;
  message?: string;
  canRemove?: boolean;
  mill?: string[];
  position?: string;
  from?: string;
  to?: string;
} 