import {PlayGateRes} from "src/game/res-types/play-gate-res.types";
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

  getSocket(): WebSocket {
    return this.socket;
  }

  tell(message: PlayGateRes): void {
    this.socket.send(JSON.stringify(message));
  }
}
