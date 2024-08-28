import { Injectable } from '@nestjs/common';
import {User} from './entities/user.entity';
import {WebSocket} from 'ws';

@Injectable()
export class UserService {
  private readonly socketToUser: Map<WebSocket, User> = new Map();

  public connectUserSocket(socket: WebSocket, idCookieVal: string): User {
    const user = new User(idCookieVal);

    user.setSocket(socket);
    this.socketToUser.set(socket, user);

    return user;
  }

  public getUserFromSocket(socket: WebSocket): User|undefined {
    return this.socketToUser.get(socket);
  }

  public disconnectUserSocket(socket: WebSocket): void {
    this.socketToUser.delete(socket);
  }
}
