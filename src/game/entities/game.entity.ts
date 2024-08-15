import {v4} from "uuid";
import WebSocket, {WebSocketServer as WSServer} from 'ws';

export class Game {
  public readonly id: string;
  public ownerId: string;
  public player1ws: WebSocket;
  public player2ws: WebSocket;
  public player1id: string;
  public player2id: string;
  
  constructor() {
    this.id = v4().substring(0, 5);
  }

  setOwner(playerId: string) {
    this.ownerId = playerId;
  }

  getOwner() {
    return this.ownerId;
  }

  join(playerId: string, playerWs: WebSocket) {
    if(!this.player1id) {
      this.player1id = playerId;
      this.player1ws = playerWs;
    } else if (this.player1id !== playerId) {
      this.player2id = playerId;
      this.player2ws = playerWs;
    }
    console.log(`Added player '${playerId}' to game '${this.id}'.`);
  }

  leave(playerId: string) {
    if(this.player1id === playerId) {
      this.player1id = null;
      this.player1ws = null;
    } else if (this.player2id === playerId) {
      this.player2id = null;
      this.player2ws = null;
    }
  }

}
