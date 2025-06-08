import { Game } from "./Game";
import { Player } from "./player";

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