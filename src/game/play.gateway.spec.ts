import {INestApplication} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayGateway } from './play.gateway';
import {WsAdapter} from '@nestjs/platform-ws';
import {GameService} from './game.service';
import {WebSocket} from 'ws';
import {setTimeout} from 'timers/promises';

describe('PlayGateway', () => {
  const gameService_mock = {
    leavePlay: () => {},
    joinGame: () => {},
  };
  let clientSocket: WebSocket;
  let gateway: PlayGateway;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule.forRoot({envFilePath: '.test.env'}) ],
      providers: [ PlayGateway, GameService ],
    })
    .overrideProvider(GameService)
    .useValue(gameService_mock)
    .compile();
    

    gateway = module.get<PlayGateway>(PlayGateway);
    app = module.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
     
    await app.listen(3000, '127.0.1.1');
  });

  afterAll(() => {
    console.log("Closing app!!!");
    app.close();
  });

  it('should be defined', () => {
    console.log("First Test");
    expect(gateway).toBeDefined();
  });
});
