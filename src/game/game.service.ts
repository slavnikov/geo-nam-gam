import { Injectable } from '@nestjs/common';
import {WsException} from '@nestjs/websockets';
import WebSocket from 'ws';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  private readonly gameCache: Map<string, Game> = new Map();
  
  create(): string {
    let newGame: Game = new Game();
    
    while(this.gameCache.has(newGame.id))
      newGame = new Game();

    this.gameCache.set(newGame.id, newGame);
    return newGame.id;
  }
  
  joinGame(gameId: string, playerId: string, playerWs: WebSocket) {
    const game: Game = this.gameCache.get(gameId);

    if(!game)
      throw new WsException('Failed to find game by id.');

    game.join(playerId, playerWs);
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
