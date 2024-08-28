import {v4} from "uuid";
import { User } from "../../user/entities/user.entity";

export class Game {
  public readonly id: string;
  private readonly players: User[] = new Array();
  private readonly maxPlayers: number;
  private owner: User;
  
  constructor() {
    this.id = v4().substring(0, 5);
    this.maxPlayers = 2;
  }

  setOwner(player: User): void {
    if(!this.hasPlayer(player)) {
      throw new Error('Player is not in the game');
    }
    this.owner = player;
  }

  getOwner(): User {
    return this.owner;
  }

  getPlayerSet(): Set<User> {
    return new Set(this.players);
  }

  hasPlayer(player: User): boolean {
    return this.getPlayerSet().has(player);
  }

  join(player: User) {
    switch(true) {
      case this.players.length >= this.maxPlayers:
        throw new Error('Game is full');
      case this.hasPlayer(player):
        throw new Error('Player is already in the game');
      default:
        this.players.push(player);
    }
  }

  leave(_: User) {
    throw new Error('Not implemented');
  }
}
