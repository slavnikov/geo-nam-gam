import {OnModuleInit} from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import WebSocket, {WebSocketServer as WSServer} from 'ws';
import {GameService} from './game.service';
import { CookieUtil } from '../cookie-util/cookie-util';
import { GateResType, CreateGameRes, JoinGameRes, PlayGateType } from './res-types/play-gate-res.types';
import {UserService} from '../user/user.service';
import {User} from '../user/entities/user.entity';

@WebSocketGateway()
export class PlayGateway implements OnModuleInit {
  @WebSocketServer()
  private server: WSServer;

  constructor(private gameService: GameService,
              private userService: UserService) { }

  onModuleInit() {
    this.server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const headerCookie = req?.headers?.cookie || '';
      const idCookieVal: string|false = CookieUtil.extractSignedCookie(headerCookie,
                                                                       'cookie_id',
                                                                       process.env.COOKIE_SECRET);

      if(idCookieVal)
        this.userService.connectUserSocket(ws, idCookieVal);
      else
        ws.close(1011, "Failed to identify connecting user.");
    });

    this.server.on('close', (ws: WebSocket) => {
      const user: User = this.userService.getUserFromSocket(ws);

      if(user) {
        this.gameService.leavePlay(user.id);
        this.userService.disconnectUserSocket(ws);
      }
    })
  }

  @SubscribeMessage(PlayGateType.CREATE_GAME)
  createGame(@ConnectedSocket() client: WebSocket): CreateGameRes {
    const playerId: string = this.userService.getUserFromSocket(client).id;
    const newGameId: string = this.gameService.create(playerId);

    return {resType: GateResType.GAME_CREATE, resData:newGameId};
  }

  @SubscribeMessage(PlayGateType.JOIN_GAME)
  joinGame(@ConnectedSocket() client: WebSocket, @MessageBody() gameId: string): JoinGameRes {
    const playerId: string = this.userService.getUserFromSocket(client).id;

    this.gameService.joinGame(gameId, playerId)
    return {resType: GateResType.GAME_JOIN};
  }


  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: WebSocket): string {
    return this.userService.getUserFromSocket(client).id;
  }

  @SubscribeMessage('echo')
  echo(@ConnectedSocket() _: WebSocket, @MessageBody() payload: string): string {
    console.log(`Echoing "${payload}"`);
    return payload;
  }
}
