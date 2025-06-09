import { Color, GameState, Position } from './types';
import { POSITIONS } from './constants';

export function getValidMovesFor(pos: string, gameState: GameState, playerColor: Color): string[] {
  if (!playerColor) return [];
  if (gameState.gamePhase === 'FLYING') {
    return POSITIONS.filter(p => !gameState.board[p.id]).map(p => p.id);
  }
  const found = POSITIONS.find(p => p.id === pos);
  return found ? found.adj.filter(adj => !gameState.board[adj]) : [];
}

export function getValidRemovalPieces(gameState: GameState, mill: string[]): string[] {
  const opponentColor = gameState.currentPlayer === 'white' ? 'black' : 'white';
  const opponentPieces = Object.entries(gameState.board)
    .filter(([pos, color]) => color === opponentColor)
    .map(([pos]) => pos);
  
  // Filter out pieces that are in mills
  const validRemovalPieces = opponentPieces.filter(pos => !mill.includes(pos));
  
  // If all pieces are in mills, allow removing any piece
  return validRemovalPieces.length > 0 ? validRemovalPieces : opponentPieces;
}

export function getGameStatus(gameState: GameState, removalMode: boolean): string {
  if (gameState.gamePhase === 'PLACING') {
    return 'SET YOUR MEN ON THE BOARD';
  }
  if (gameState.winner) {
    return `WINNER: ${gameState.winner.toUpperCase()}`;
  }
  if (removalMode) {
    return 'REMOVE AN OPPONENT PIECE';
  }
  return 'MOVE YOUR MEN';
} 