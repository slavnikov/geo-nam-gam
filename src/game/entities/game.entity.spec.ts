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

   //it('should be able to join players', () => {
     //expect(game.player1id).toBeUndefined();
     //expect(game.player2id).toBeUndefined();
     //game.join('player1', null);
     //expect(game.player1id).toBe('player1');
     //expect(game.player2id).toBeUndefined();
     //game.join('player2', null);
     //expect(game.player1id).toBe('player1');
     //expect(game.player2id).toBe('player2');
   //});
 //
   //it('should be able to remove players', () => {
     //game.join('player1', null);
     //game.join('player2', null);
     //game.leave('player1');
     //expect(game.player1id).toBeNull();
     //game.leave('player2');
     //expect(game.player2id).toBeNull();
   //});
});
