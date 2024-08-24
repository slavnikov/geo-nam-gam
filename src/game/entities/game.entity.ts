import {v4} from "uuid";

export class Game {
  public readonly id: string;
  public ownerId: string;
  public player1id: string;
  public player2id: string;
  
  constructor() {
    this.id = v4().substring(0, 5);
  }

  setOwner(playerId: string): void {
    this.ownerId = playerId;
  }

  getOwner() {
    return this.ownerId;
  }

  join(playerId: string) {
    if(!this.player1id) {
      this.player1id = playerId;
    } else if (this.player1id !== playerId) {
      this.player2id = playerId;
    }
    console.log(`Added player '${playerId}' to game '${this.id}'.`);
  }

  leave(playerId: string) {
    if(this.player1id === playerId) {
      this.player1id = null;
    } else if (this.player2id === playerId) {
      this.player2id = null;
    }
  }

}
