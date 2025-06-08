import { Game } from "./Game";
import { Player } from "./player";

export class GameManager{
    private games:Map <string,Game>=new Map();
    public findOrCreateGame(player: Player): Game {
        // First, try to find a game that's not full
        for (const game of this.games.values()) {
            if (game.players.length < 2) {
                game.addPlayer(player);
                return game;
            }
        }

        // If no available game found, create a new one
        const newGame = new Game();
        newGame.addPlayer(player);
        this.games.set(newGame.id, newGame);
        return newGame;
    }
    public removeGame(gameId: string) {
        this.games.delete(gameId);
    }

}