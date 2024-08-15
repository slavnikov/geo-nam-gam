import { Test, TestingModule } from '@nestjs/testing';
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

  it('should be able to set and get an owner id', () => {
    expect(game.ownerId).toBeUndefined();
    game.setOwner('test');
    expect(game.ownerId).toBe('test');
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
