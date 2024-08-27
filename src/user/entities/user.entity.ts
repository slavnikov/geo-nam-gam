import {WebSocket} from "ws";

export class User {
  public readonly id: string;
  private socket: WebSocket;

  constructor(id: string) {
    this.id = id;
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }
}
