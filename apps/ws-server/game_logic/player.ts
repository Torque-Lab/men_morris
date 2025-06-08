import {WebSocket} from "ws"
interface Ptype{
    id:string
    roomId:string
    ws:WebSocket
    color:color
}
type color="white" | "black" | null
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




