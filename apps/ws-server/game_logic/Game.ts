import { Board } from "./board";
import { Player } from "./player";

export function genId()
{
    const id=(Math.floor((Math.random())*10000)).toString()
    return id;
}
export class Game{

    public id= genId()
    public players:Player[]=[]
    public board=new Board()
    private currentTurn=0;

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


public handleMove(position: string, playerId: string) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;

    const success = this.board.placePiece(position, player.color);
    if (!success) return false;

    player.placedPieces++;
    
    this.lastMoveFormedMill = this.board.isMill(position, player.color);
    
    if (!this.lastMoveFormedMill) {
        this.currentTurn = 1 - this.currentTurn;
    }
    
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
    return true;
}

}