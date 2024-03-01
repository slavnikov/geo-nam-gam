import {INestApplication} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayGateway } from './play.gateway';
import {WsAdapter} from '@nestjs/platform-ws';
import {GameService} from './game.service';
import {WebSocket} from 'ws';

describe('PlayGateway', () => {
  const gameService_mock = {
    leavePlay: () => {},
    joinGame: () => {},
  };
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
    app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should be able to detect a socket connection request', async () => {
    const resWaiter: boolean = await new Promise<boolean>((resolve, _) => {
      const clientSocket = new WebSocket('http://127.0.1.1:3000');

      clientSocket.on('open', () => {
        resolve(true);
      });
      setTimeout(() => resolve(false), 1000)
    });

    expect(resWaiter).toBeTruthy();
  });

  it('should close a socket opened without a cookie', async() => {
    const resWaiter: boolean = await new Promise<boolean>((resolve, _) => {
      const clientSocket = new WebSocket('http://127.0.1.1:3000');

      clientSocket.on('close', (code:number) => {
        if(code === 1011)
          resolve(true);
      });
      setTimeout(() => resolve(false), 1000)
    });

    expect(resWaiter).toBeTruthy();
  });

  it('should close a socket opened with a tampered cookie', async() => {
    const resWaiter: boolean = await new Promise<boolean>((resolve, _) => {
      const rawCookieVal = 's%3A8c48fcfa-065e-4955-a61a-e43613015f12.B1qK%2BSYNy%2F83y0GT3J1cJvu09fwp63aXLsI%2FUk0z2G8';
      const clientSocket = new WebSocket('http://127.0.1.1:3000', {headers: {cookie: `cookie_id=${rawCookieVal};`}});

      clientSocket.on('close', (code:number) => {
        if(code === 1011)
          resolve(true);
      });
      setTimeout(() => resolve(false), 1000)
    });

    expect(resWaiter).toBeTruthy();
  });

  it('should stay open if connected with a valid cookie', async() => {
    const playerCacheSetter = jest.spyOn(gateway.playerCache, 'set');
    const resWaiter: boolean = await new Promise<boolean>((resolve, _) => {
      const rawCookieVal = 's%3A8c48fcfa-065e-4955-a61a-e43613015f12.A1qK%2BSYNy%2F83y0GT3J1cJvu09fwp63aXLsI%2FUk0z2G8';
      const clientSocket = new WebSocket('http://127.0.1.1:3000', {headers: {cookie: `cookie_id=${rawCookieVal};`}});
      let stayedOpen: boolean = false;

      clientSocket.on('close', () => {
        resolve(stayedOpen === true);
      });
      setTimeout(() => {
        stayedOpen = true;
        clientSocket.close();
      }, 1000)
    });

    expect(resWaiter).toBeTruthy();
    expect(playerCacheSetter).toHaveBeenCalledTimes(1);
  });
});
