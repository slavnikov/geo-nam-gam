import {OnModuleInit} from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import WebSocket, {WebSocketServer as wsWebSocketServer} from 'ws';

import * as cookieParser from 'cookie-parser';
import {GameService} from './game.service';

@WebSocketGateway()
export class PlayGateway implements OnModuleInit {
  @WebSocketServer()
  server: wsWebSocketServer;
  playerCache: WeakMap<WebSocket, string> = new WeakMap();

  constructor(private gameService: GameService) { }

  onModuleInit() {
    this.server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const cookie: string = req.headers.cookie || "";
      const cookies: string[] = cookie.split('; ');
      const idCookie: string|false = cookies.find(cookie => cookie.startsWith('cookie_id'));
      const signedIdCookieVal: string|false = idCookie && idCookie.split('=')[1].replace('s%3A', 's:');
      const idCookieVal: string|false = signedIdCookieVal && cookieParser.signedCookie(signedIdCookieVal, process.env.COOKIE_SECRET);

      if(idCookieVal) {
        this.playerCache.set(ws, idCookieVal);
      } else {
        ws.close();
        throw new WsException('Failed to establish connection identity;');
      }
    });
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: WebSocket, @MessageBody() payload: string): string {
    return this.playerCache.get(client);
  }

  @SubscribeMessage('join')
  joinGame(@ConnectedSocket() client: WebSocket, @MessageBody('gameId') gameId: string): void {

  }
}
