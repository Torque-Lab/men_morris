import { Position, GameState } from './types';

export const POSITIONS: Position[] = [
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

export const initialBoard = Object.fromEntries(POSITIONS.map(p => [p.id, null]));

export const initialGameState: GameState = {
  board: { ...initialBoard },
  currentPlayer: 'white',
  gamePhase: 'PLACING',
  winner: null,
  remainingPieces: { white: 9, black: 9 },
}; 