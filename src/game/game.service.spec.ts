import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { User } from '../user/entities/user.entity';

describe('GameService', () => {
  const client = new User("test-client-id");
  const client2 = new User("test-client-id-2");
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start with an empty game cahce', () => {
    expect(service.findAll()).toHaveLength(0);
  });

  it('should add created games to the cache', () => {
    const creationRes1 = service.userCreateGame(new User("foo"));
    const creationRes2 = service.userCreateGame(new User("bar"));
    const creationRes3 = service.userCreateGame(new User("baz"));

    expect(service.findAll()).toHaveLength(3);

    expect(service.findAll()).toContain(creationRes1);
    expect(service.findAll()).toContain(creationRes2);
    expect(service.findAll()).toContain(creationRes3);

    expect(service.findOne(creationRes1)).toBeInstanceOf(Game);
    expect(service.findOne(creationRes2)).toBeInstanceOf(Game);
    expect(service.findOne(creationRes3)).toBeInstanceOf(Game);
  });

  it('should return the id of the created game', () => {
    const creationRes: string = service.userCreateGame(client);

    expect(creationRes).toBeTruthy();
    expect(creationRes.length).toBe(5);
    expect(creationRes).toMatch(/^[a-f0-9]+$/);
    expect(service.findAll()).toContain(creationRes);
  });

  it('should set the owner of the game to the client id of the creator', () => {
    const creationRes: string = service.userCreateGame(client);
    const game: Game = service.findOne(creationRes);

    expect(game.getOwner()).toBe(client);
  });

  it('should register a user to a game when the user creates the game', () => {
    const creationRes: string = service.userCreateGame(client);
    const game: Game = service.findOne(creationRes);

    expect(service.getUsersGame(client)).toBe(game);
  });

  it('should register a user to a game when the user joins the game', () => {
    const creationRes: string = service.userCreateGame(client);
    const game: Game = service.findOne(creationRes);

    service.joinGame(creationRes, client2);
    expect(service.getUsersGame(client2)).toBe(game);
  });

  it('should throw an exception when a user tries to join more than one game', () => {
    const creationRes1: string = service.userCreateGame(client);
    service.userCreateGame(client2);

    expect(() => service.joinGame(creationRes1, client2)).toThrow();
  });

  it('should thow an exception when a user tries to join a non-existent game', () => {
    expect(() => service.joinGame('non-existent-game', client2)).toThrow();
  });
});
