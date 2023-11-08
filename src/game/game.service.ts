import { Injectable } from '@nestjs/common';
import {WsException} from '@nestjs/websockets';
import WebSocket from 'ws';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  private readonly gameCache: Map<string, Game> = new Map();
  
  create(): string {
    const newGame: Game = new Game();

    this.gameCache[newGame.id] = newGame;
    return newGame.id;
  }
  
  joinGame(gameId: string, playerId: string, playerWs: WebSocket) {
    if(this.gameCache.has(gameId))
      throw new WsException('Failed to find game by id.');
  }

  findAll(): string[] {
    return Object.keys(this.gameCache);
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
