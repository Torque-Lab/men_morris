import {WebSocket} from "ws"

interface PlayerType {
    id: string;
    roomId: string;
    ws: WebSocket;
    color?: 'white' | 'black';
}

export class Player {
    public id: string;
    public roomId: string;
    public ws: WebSocket;
    public color: 'white' | 'black';
    public placedPieces: number;
    public readonly totalPieces: number;

    constructor({ id, roomId, ws, color }: PlayerType) {
        this.id = id;
        this.ws = ws;
        this.roomId = roomId;
        this.color = color || 'white';
        this.placedPieces = 0;
        this.totalPieces = 9;
    }

    public canPlacePiece(): boolean {
        return this.placedPieces < this.totalPieces;
    }

    public placePiece(): void {
        if (this.canPlacePiece()) {
            this.placedPieces++;
        }
    }

    public getRemainingPieces(): number {
        return this.totalPieces - this.placedPieces;
    }
}




