import { WebSocketServer, WebSocket } from "ws";
import { genId, Game, GamePhase } from "../game_logic/Game"
import { Player } from "../game_logic/player"
import { GameManager } from "../game_logic/game_manager";

const wss = new WebSocketServer({ port: 3005 });
const manager = new GameManager();

const playerMap = new Map<string, WebSocket>();
const gamePlayers = new Map<string, WebSocket[]>();

// Initialize empty board
const initialBoard = Object.fromEntries([
    "a1", "d1", "g1",
    "b2", "d2", "f2",
    "c3", "d3", "e3",
    "a4", "b4", "c4",
    "e4", "f4", "g4",
    "c5", "d5", "e5",
    "b6", "d6", "f6",
    "a7", "d7", "g7"
].map(pos => [pos, null]));

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    
    const id = genId();
    const roomId = "1";
    const player = new Player({ id, roomId, ws });
    let game = manager.findOrCreateGame(player);

    playerMap.set(id, ws);

    if (!gamePlayers.has(game.id)) {
        gamePlayers.set(game.id, []);
    }
    gamePlayers.get(game.id)!.push(ws);

    // Send welcome message with assigned color
    ws.send(JSON.stringify({ type: "welcome", color: player.color }));

    // If game can start, send start message to all players
    if (game.startGame()) {
        const state = game.getGameState();
        game.players.forEach(p =>
            p.ws.send(JSON.stringify({ type: "start", state, success: true }))
        );
    }

    ws.on("message", (msg: Buffer) => {
        try {
            const data = JSON.parse(msg.toString());
            console.log("Received message:", data);
            
            let success = false;
            let state: ReturnType<Game['getGameState']> | undefined;
            let message = "";

            switch (data.type) {
                case "place":
                    success = game.handleMove(data.position, player.id);
                    message = success ? "Piece placed successfully" : "Invalid placement";
                    break;
                case "move":
                    success = game.handleMovement(data.from, data.to, player.id);
                    message = success ? "Piece moved successfully" : "Invalid movement";
                    break;
                case "remove":
                    success = game.removePiece(data.position, player.id);
                    message = success ? "Piece removed successfully" : "Invalid removal";
                    if (success) {
                        state = game.getGameState();
                        // Check if the opponent has less than 3 pieces
                        const opponentColor = state.currentPlayer === 'white' ? 'black' : 'white';
                        const opponentPieces = Object.values(state.board)
                            .filter(piece => piece === opponentColor).length;
                        if (opponentPieces < 3) {
                            state.winner = state.currentPlayer;
                            message = `${state.currentPlayer.toUpperCase()} wins!`;
                        }
                    }
                    break;
                case "restart":
                    // Create a new game for the players
                    const newGame = new Game();
                    // Reset player states
                    game.players.forEach(p => {
                        p.placedPieces = 0;
                        newGame.addPlayer(p);
                    });
                    // Remove old game and add new one
                    manager.removeGame(game.id);
                    manager.addGame(newGame);
                    game = newGame;
                    // Reset game state
                    state = {
                        board: { ...initialBoard },
                        currentPlayer: 'white',
                        gamePhase: GamePhase.PLACING,
                        winner: null,
                        remainingPieces: { white: 9, black: 9 }
                    };
                    message = "Game restarted";
                    success = true;
                    break;
            }

            if (success) {
                if (!state) {
                    state = game.getGameState();
                }
                let mill: string[] = [];
                let canRemove = false;
                
                if ((data.type === 'place' || data.type === 'move') && game.getLastMillPositions) {
                    mill = game.getLastMillPositions();
                    canRemove = mill.length > 0;
                }
                
                game.players.forEach(p =>
                    p.ws.send(JSON.stringify({ 
                        type: data.type, 
                        state,
                        success: true,
                        message,
                        mill,
                        canRemove
                    }))
                );
            } else {
                ws.send(JSON.stringify({ 
                    type: data.type, 
                    success: false,
                    message
                }));
            }
        } catch (error) {
            console.error("Error processing message:", error);
            ws.send(JSON.stringify({ 
                type: "error", 
                success: false,
                message: "Invalid message format"
            }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        playerMap.delete(id);
        const gameWs = gamePlayers.get(game.id);
        if (gameWs) {
            const index = gameWs.indexOf(ws);
            if (index > -1) {
                gameWs.splice(index, 1);
            }
            if (gameWs.length === 0) {
                gamePlayers.delete(game.id);
                manager.removeGame(game.id);
            }
        }
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket server is running on port 3005");
