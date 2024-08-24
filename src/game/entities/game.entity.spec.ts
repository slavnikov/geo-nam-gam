import { Game } from "./game.entity";

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
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
    expect(game.hasPlayer('player1')).toBe(false);
    game.join('player1');
    expect(game.hasPlayer('player1')).toBe(true);
  });

  it('should throw and error if too many players join', () => {
    game.join('player1');
    game.join('player2');

    expect(() => game.join('player3')).toThrowError('Game is full');
  });

  it('should allow an existing player to become the owner', () => {
    game.join('player1');
    game.setOwner('player1');
    expect(game.getOwner()).toBe('player1');
  });

  it('should throw an error if a non-player tries to become the owner', () => {
    expect(() => game.setOwner('player1')).toThrowError('Player is not in the game');
  });

  it('should error when a user attempts to join the same game twice', () => {
    game.join('player1');
    expect(() => game.join('player1')).toThrowError('Player is already in the game');
  });
});
