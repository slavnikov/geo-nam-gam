import {INestApplication} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayGateway } from './play.gateway';
import {WsAdapter} from '@nestjs/platform-ws';
import {GameService} from './game.service';
import {WebSocket} from 'ws';
import {setTimeout} from 'timers/promises';
import {GameModule} from './game.module';

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
      providers: [PlayGateway, GameService],
    })
    .overrideProvider(GameService)
    .useValue(gameService_mock)
    .compile();
    

    gateway = module.get<PlayGateway>(PlayGateway);
    app = module.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
     
    await app.listen(3000, '127.0.1.1');
    const val = await app.getUrl();

    await setTimeout(1000);
    console.log(val);
  });

  afterAll(() => {
    console.log("Closing app!!!");
    app.close();
  });

  it('should be defined', () => {
    console.log("First Test");
    expect(gateway).toBeDefined();
  });
  
  it('should echo a WebScoket request', async () => {
    clientSocket = new WebSocket('http://127.0.1.1:3000');
    clientSocket.on('open', () => console.log('Client WS Open!'))
    clientSocket.on('close', (code, buffer) => console.log(code, buffer.toString()))
    console.log("Second Test");
    //clientSocket.ping("ping", false, (err) => console.log(err));
    await setTimeout(4000);
  });
  it('should echo a WebScoket request', async () => {
    clientSocket = new WebSocket('http://127.0.1.1:3000');
    clientSocket.on('open', () => console.log('Client WS Open!'))
    clientSocket.on('close', (code, buffer) => console.log(code, buffer.toString()))
    console.log("Third Test");
    //clientSocket.ping("ping", false, (err) => console.log(err));
    await setTimeout(4000);
  });
});
