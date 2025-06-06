import {WebSocket} from "ws"

interface Ptype{
    id:string
    roomId:string
    ws:WebSocket
    color:color
}
type color="white" | "black"
export class Player{
    public id:string
    public roomId:string
    public ws:WebSocket
    public color:color
    public placedPieces:number
    public readonly totalPieces:number

    constructor({id,roomId,ws,color}:Ptype){
        this.id=id;
        this.ws=ws
        this.roomId=roomId
        this.color=color
        this.placedPieces=0;
        this.totalPieces=9

        
    }



}


type Position=string;
type Piece="white" | "black" | null;

class  Board{
// board object with all point
private positions:Record<Position,Piece>={}

constructor() {
    const allPositions = [
        //top three
      "a1", "d1", "g1", 
      "b2", "d2", "f2",
      "c3", "d3", "e3",

      //bottom three
      "a4", "b4", "c4", 
      "e4", "f4", "g4",
      "c5", "d5", "e5",

      // two remining
      "b6", "d6", "f6",
      "a7", "d7", "g7"
    ];
    for (const pos of allPositions) {
      this.positions[pos] = null;
    }
  }

  public placePiece(position: Position, color: Piece): boolean {
    if (this.positions[position] !== null) return false;
    this.positions[position] = color;
    return true;
  }

  public movePiece(from: Position, to: Position, color: Piece): boolean {
    if (this.positions[from] !== color || this.positions[to] !== null) return false;
    this.positions[from] = null;
    this.positions[to] = color;
    return true;
  }


  public getState(): Record<Position, Piece> {
    return this.positions;
  }

}


export function genId()
{
    const id=(Math.floor((Math.random())*10000)).toString()
    return id;
}
    
class Game{

    public id= genId()
    private players:Player[]=[]
    private board=new Board()
    private currentTurn=0;

    public addPlayer(player: Player) {
        if (this.players.length >= 2) throw new Error("Game is full");
        this.players.push(player);
      }
      public startGame(): boolean {
    return this.players.length === 2;
  }
  public getCurrentPlayer(): Player {
    return this.players[this.currentTurn];
  }

  public handleMove(position: string, playerId: string) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player !== this.getCurrentPlayer()) return false;

    const success = this.board.placePiece(position, player.color);
    if (!success) return false;

    player.placedPieces++;
    this.currentTurn = 1 - this.currentTurn;
    return true;
  }

  public getGameState() {
    return {
      board: this.board.getState(),
      currentTurn: this.players[this.currentTurn].color,
    };
  }

}




export class GameManager{
    
    private games:Map <string,Game>=new Map();

    public findOrCreateGame(player: Player): Game {
        for (const game of this.games.values()) {
          if (game.startGame() === false) {
            game.addPlayer(player);
            return game;
          }
        }
        const newGame = new Game();
        newGame.addPlayer(player);
        this.games.set(newGame.id, newGame);
        return newGame;
        
}
public removeGame(gameId: string) {
    this.games.delete(gameId);
}

}