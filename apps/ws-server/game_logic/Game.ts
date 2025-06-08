import { Board } from "./board";
import { Player } from "./player";

export function genId()
{
    const id=(Math.floor((Math.random())*10000)).toString()
    return id;
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
    private winner: Player | null = null;

    public addPlayer(player: Player) {
        if (this.players.length >= 2) throw new Error("Game is full");
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

private lastMoveFormedMill = false;

private checkWinCondition(): boolean {
    const opponent = this.players[1 - this.currentTurn];
    if (!opponent) return false;
    
    const opponentPieces = Object.values(this.board.getState())
        .filter(piece => piece === opponent.color).length;
    
    if (opponentPieces < 3) {
        this.winner = this.getCurrentPlayer();
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

public handleMove(position: string, playerId: string) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;

    if (this.gamePhase === GamePhase.PLACING) {
        const success = this.board.placePiece(position, player.color);
        if (!success) return false;

        player.placedPieces++;
        this.lastMoveFormedMill = this.board.isMill(position, player.color);
        
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

    const success = this.board.movePiece(from, to, player.color);
    if (!success) return false;

    this.lastMoveFormedMill = this.board.isMill(to, player.color);
    
    if (!this.lastMoveFormedMill) {
        this.currentTurn = 1 - this.currentTurn;
    }

    this.updateGamePhase();
    this.checkWinCondition();
    return true;
}

public removePiece(position: string, playerId: string): boolean {
    const player = this.players.find(p => p.id === playerId);
    const opponent = this.players[1 - this.players.indexOf(player!)];
    
    if (!this.lastMoveFormedMill || player !== this.getCurrentPlayer()) {
        return false;
    }
    
    const piece = this.board.getState()[position];
    if (piece !== opponent!.color) {
        return false;
    }
    
    this.board.placePiece(position, null);
    this.lastMoveFormedMill = false;
    this.currentTurn = 1 - this.currentTurn;
    
    this.checkWinCondition();
    return true;
}

public getGameState() {
    return {
        board: this.board.getState(),
        currentPlayer: this.getCurrentPlayer(),
        gamePhase: this.gamePhase,
        winner: this.winner
    };
}

}