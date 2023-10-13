import { Test, TestingModule } from '@nestjs/testing';
import {validate} from 'uuid';
import { GameService } from './game.service';

describe('GameService', () => {
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

  it('should create a game with a new guid', () => {
    const creationRes: string = service.create();
    const isUUID: boolean = validate(creationRes);

    expect(isUUID).toBeTruthy();
  });

  it('should start with an empty game cahce', () => {
    expect(service.findAll()).toHaveLength(0);
  });

  it('should add created games to the cache', () => {
    const creationRes1 = service.create();
    const creationRes2 = service.create();
    const creationRes3 = service.create();
    
    expect(service.findAll()).toHaveLength(3);
    expect(service.findAll()).toContain(creationRes1);
    expect(service.findAll()).toContain(creationRes2);
    expect(service.findAll()).toContain(creationRes3);
  });
});
