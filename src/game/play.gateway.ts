import {OnModuleInit} from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import WebSocket, {WebSocketServer as WSServer} from 'ws';
import {GameService} from './game.service';
import { CookieUtil } from '../cookie-util/cookie-util';

@WebSocketGateway()
export class PlayGateway implements OnModuleInit {
  @WebSocketServer()
  private server: WSServer;
  private playerCache: Map<WebSocket, string> = new Map();

  constructor(private gameService: GameService) { }

  onModuleInit() {
    this.server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const headerCookie = req?.headers?.cookie || '';
      const idCookieVal: string|false = CookieUtil.extractSignedCookie(headerCookie,
                                                                       'cookie_id',
                                                                       process.env.COOKIE_SECRET);

      if(idCookieVal)
        this.playerCache.set(ws, idCookieVal);
      else
        ws.close(1011, "Failed to identify connecting user.");
    });

    this.server.on('close', (ws: WebSocket) => {
      const idCookieVal: string = this.playerCache.get(ws);

      this.gameService.leavePlay(idCookieVal);
      this.playerCache.delete(ws);
    })
  }

  @SubscribeMessage('join')
  joinGame(@ConnectedSocket() client: WebSocket, @MessageBody() gameId: string): void {
    const playerId = this.playerCache.get(client);

    this.gameService.joinGame(gameId, playerId, client)
  }


  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: WebSocket): string {
    const playerCookie = this.playerCache.get(client);

    return playerCookie;
  }

  @SubscribeMessage('echo')
  echo(@ConnectedSocket() _: WebSocket, @MessageBody() payload: string): string {
    console.log(`Echoing "${payload}"`);
    return payload;
  }
}
