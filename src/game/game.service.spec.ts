import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';

describe('GameService', () => {
  const clientId = 'test-client-id';
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
    const creationRes1 = service.create(clientId);
    const creationRes2 = service.create(clientId);
    const creationRes3 = service.create(clientId);

    expect(service.findAll()).toHaveLength(3);

    expect(service.findAll()).toContain(creationRes1);
    expect(service.findAll()).toContain(creationRes2);
    expect(service.findAll()).toContain(creationRes3);

    expect(service.findOne(creationRes1)).toBeInstanceOf(Game);
    expect(service.findOne(creationRes2)).toBeInstanceOf(Game);
    expect(service.findOne(creationRes3)).toBeInstanceOf(Game);
  });

  it('should return the id of the created game', () => {
    const creationRes: string = service.create(clientId);

    expect(creationRes).toBeTruthy();
    expect(creationRes.length).toBe(5);
    expect(creationRes).toMatch(/^[a-f0-9]+$/);
    expect(service.findAll()).toContain(creationRes);
  });

  it('should set the owner of the game to the client id', () => {
    const creationRes: string = service.create(clientId);
    const game: Game = service.findOne(creationRes);

    expect(game.getOwner()).toBe(clientId);
  });
});
