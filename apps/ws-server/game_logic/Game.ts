import { Board } from "./board";
import { Player } from "./player";

export function genId()
{
    return Math.floor(Math.random() * 10000).toString();
}

export enum GamePhase {
    PLACING = "PLACING",
    MOVING = "MOVING",
    FLYING = "FLYING"
}

export class Game{

    public id= genId()
    public players:Player[]=[]
    public board=new Board()
    private currentTurn=0;
    private gamePhase: GamePhase = GamePhase.PLACING;
    private winner: 'white' | 'black' | null = null;
    private lastMoveFormedMill = false;
    private lastMillPositions: string[] = [];

    public addPlayer(player: Player) {
        if (this.players.length >= 2) throw new Error("Game is full");
        if (this.players.length === 1) {
            player.color = 'black';
        }
        this.players.push(player);
    }
    public startGame(): boolean {
    return this.players.length === 2;
  }
  public getCurrentPlayer(): Player {
    const player = this.players[this.currentTurn];
    if (!player) {
        throw new Error('No player found at current turn');
    }
    return player;
}

private checkWinCondition(): boolean {
    const opponent = this.players[1 - this.currentTurn];
    if (!opponent) return false;
    
    const opponentPieces = Object.values(this.board.getState())
        .filter(piece => piece === opponent.color).length;
    
    if (opponentPieces < 3) {
        this.winner = this.getCurrentPlayer().color;
        return true;
    }
    return false;
}

private updateGamePhase() {
    const currentPlayer = this.getCurrentPlayer();
    const playerPieces = Object.values(this.board.getState())
        .filter(piece => piece === currentPlayer.color).length;

    if (this.gamePhase === GamePhase.PLACING && currentPlayer.placedPieces === 9) {
        this.gamePhase = GamePhase.MOVING;
    } else if (this.gamePhase === GamePhase.MOVING && playerPieces === 3) {
        this.gamePhase = GamePhase.FLYING;
    }
}

public handleMove(position: string, playerId: string): boolean {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;

    if (this.gamePhase === GamePhase.PLACING) {
        if (!player.canPlacePiece()) return false;

        const success = this.board.placePiece(position, player.color);
        if (!success) return false;

        player.placePiece();
        this.lastMoveFormedMill = this.board.isMill(position, player.color);
        this.lastMillPositions = [];
        if (this.lastMoveFormedMill) {
            this.lastMillPositions = this.board.getMillCombination(position, player.color);
        }
        if (!this.lastMoveFormedMill) {
            this.currentTurn = 1 - this.currentTurn;
        }
        this.updateGamePhase();
        return true;
    }
    return false;
}

public handleMovement(from: string, to: string, playerId: string): boolean {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;

    if (this.gamePhase !== GamePhase.MOVING && this.gamePhase !== GamePhase.FLYING) {
        return false;
    }

    const isFlying = this.gamePhase === GamePhase.FLYING;
    const success = this.board.movePiece(from, to, player.color, isFlying);
    if (!success) return false;

    this.lastMoveFormedMill = this.board.isMill(to, player.color);
    this.lastMillPositions = [];
    if (this.lastMoveFormedMill) {
        this.lastMillPositions = this.board.getMillCombination(to, player.color);
    }
    if (!this.lastMoveFormedMill) {
        this.currentTurn = 1 - this.currentTurn;
    }
    this.updateGamePhase();
    this.checkWinCondition();
    return true;
}

public removePiece(position: string, playerId: string): boolean {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;
    
    const opponent = this.players[1 - this.players.indexOf(player)];
    if (!opponent) return false;
    
    if (!this.lastMoveFormedMill) {
        return false;
    }
    
    const piece = this.board.getState()[position];
    if (piece !== opponent.color) {
        return false;
    }

    // Check if the piece is in a mill
    const isInMill = this.board.isMill(position, opponent.color);
    const allOpponentPieces = Object.entries(this.board.getState())
        .filter(([_, color]) => color === opponent.color)
        .map(([pos]) => pos);
    const allOpponentPiecesInMills = allOpponentPieces.every(pos => this.board.isMill(pos, opponent.color));
    
    // Only allow removing if piece is not in a mill, or if all pieces are in mills
    if (isInMill && !allOpponentPiecesInMills) {
        return false;
    }
    
    // Remove the piece using the dedicated removePiece method
    const success = this.board.removePiece(position);
    if (!success) return false;

    this.lastMoveFormedMill = false;
    this.currentTurn = 1 - this.currentTurn;
    
    this.checkWinCondition();
    return true;
}

public getGameState() {
    return {
        board: this.board.getState(),
        currentPlayer: this.getCurrentPlayer().color,
        gamePhase: this.gamePhase,
        winner: this.winner,
        remainingPieces: {
            white: this.players.find(p => p.color === 'white')?.getRemainingPieces() ?? 9,
            black: this.players.find(p => p.color === 'black')?.getRemainingPieces() ?? 9
        }
    };
}

public getLastMillPositions(): string[] {
    return this.lastMillPositions;
}

}