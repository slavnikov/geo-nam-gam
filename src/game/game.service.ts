import { Injectable } from '@nestjs/common';
import {WsException} from '@nestjs/websockets';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  private readonly gameCache: Map<string, Game> = new Map();
  private readonly userIdToGame: Map<string, Game> = new Map();
  
  create(clientId: string): string {
    let newGame: Game = new Game();
    
    // If a game with the same id already exists, generate a new id.
    while(this.gameCache.has(newGame.id))
      newGame = new Game();

    this.registerGame(newGame);
    newGame.join(clientId);
    newGame.setOwner(clientId);
    return newGame.id;
  }

  joinGame(gameId: string, playerId: string) {
    const game: Game = this.gameCache.get(gameId);

    if(!game)
      throw new WsException('Failed to find game by id.');
    if(this.userIdToGame.has(playerId))
      throw new WsException('User cannot join more than one game at a time.');

    game.join(playerId);
    this.userIdToGame.set(playerId, game);
  }

  leavePlay(playerId: string) {
    const game: Game|undefined = this.userIdToGame.get(playerId);

    if(game)
      game.leave(playerId);
  }

  private registerGame(game: Game): void {
    this.gameCache.set(game.id, game);
  }

  findAll(): string[] {
    return Array.from(this.gameCache.keys());
  }

  findOne(id: string) : Game|undefined {
    return this.gameCache.get(id);
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
