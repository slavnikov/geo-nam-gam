import {User} from "../../user/entities/user.entity";
import { Game } from "./game.entity";

describe('Game', () => {
  let game: Game;
  let player: User; 

  beforeEach(() => {
    game = new Game();
    player = new User('player1');
  });

  it('should be defined', () => {
    expect(game).toBeDefined();
  });

  it('should have a 5 character id', () => {
    expect(game.id).toBeTruthy();
    expect(game.id.length).toBe(5);
    expect(game.id).toMatch(/^[a-f0-9]+$/);
  });

  it('should allow a player to join', () => {
    expect(game.hasPlayer(player)).toBe(false);
    game.join(player);
    expect(game.hasPlayer(player)).toBe(true);
  });

  it('should throw and error if too many players join', () => {
    const player2 = new User('player2');
    const player3 = new User('player3');
    game.join(player);
    game.join(player2);

    expect(() => game.join(player3)).toThrow('Game is full');
  });

  it('should allow an existing player to become the owner', () => {
    game.join(player);
    game.setOwner(player);
    expect(game.getOwner()).toBe(player);
  });

  it('should throw an error if a non-player tries to become the owner', () => {
    expect(() => game.setOwner(player)).toThrow('Player is not in the game');
  });

  it('should error when a user attempts to join the same game twice', () => {
    game.join(player);
    expect(() => game.join(player)).toThrow('Player is already in the game');
  });
});
