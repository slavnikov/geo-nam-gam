import {OnModuleInit} from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import WebSocket, {WebSocketServer as WSServer} from 'ws';

import * as cookieParser from 'cookie-parser';
import {GameService} from './game.service';

@WebSocketGateway()
export class PlayGateway implements OnModuleInit {
  @WebSocketServer()
  server: WSServer;
  playerCache: Map<WebSocket, string> = new Map();

  constructor(private gameService: GameService) { }

  onModuleInit() {
    this.server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const idCookieVal: string|false = this.extractCookieIdFromSocket(req);

      if(idCookieVal) {
        this.playerCache.set(ws, idCookieVal);
      } else {
        ws.close();
        throw new WsException('Failed to establish connection identity;');
      }
    });

    this.server.on('close', (ws: WebSocket) => {
      const idCookieVal: string = this.playerCache.get(ws);

      this.gameService.leavePlay(idCookieVal);
      this.playerCache.delete(ws);
    })
  }

  @SubscribeMessage('join')
  joinGame(@ConnectedSocket() playerWs: WebSocket, @MessageBody() gameId: string): void {
    const playerId = this.playerCache.get(playerWs);

    try {
      this.gameService.joinGame(gameId, playerId, playerWs)
    } catch (wsErr: any) {
      playerWs.send(JSON.stringify({event: 'error'}));
    }
  }

  private extractCookieIdFromSocket(req: IncomingMessage): string|false {
    const cookie: string = req.headers.cookie || "";
    const cookies: string[] = cookie.split('; ');
    const idCookie: string|false = cookies.find(cookie => cookie.startsWith('cookie_id'));
    const signedIdCookieVal: string|false = idCookie && idCookie.split('=')[1].replace('s%3A', 's:');
    const idCookieVal: string|false = signedIdCookieVal && cookieParser.signedCookie(signedIdCookieVal, process.env.COOKIE_SECRET);

    return idCookieVal;
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: WebSocket): string {
    const playerCookie = this.playerCache.get(client);

    console.log(`Pinging back to '${playerCookie}'`);
    return playerCookie;
  }

  @SubscribeMessage('echo')
  echo(@ConnectedSocket() _: WebSocket, @MessageBody() payload: string): string {
    console.log(`Echoing "${payload}"`);
    return payload;
  }
}
