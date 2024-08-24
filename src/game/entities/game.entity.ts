import {v4} from "uuid";

export class Game {
  public readonly id: string;
  private readonly players: string[] = new Array();
  private readonly maxPlayers: number;
  private ownerId: string;
  
  constructor() {
    this.id = v4().substring(0, 5);
    this.maxPlayers = 2;
  }

  setOwner(playerId: string): void {
    if(!this.hasPlayer(playerId)) {
      throw new Error('Player is not in the game');
    }
    this.ownerId = playerId;
  }

  getOwner(): string {
    return this.ownerId;
  }

  getPlayerSet(): Set<string> {
    return new Set(this.players);
  }

  hasPlayer(playerId: string): boolean {
    return this.getPlayerSet().has(playerId);
  }

  join(playerId: string) {
    if(this.players.length < this.maxPlayers) {
      this.players.push(playerId);
    } else {
      throw new Error('Game is full');
    }
  }

  leave(playerId: string) {
    throw new Error('Not implemented');
  }
}
