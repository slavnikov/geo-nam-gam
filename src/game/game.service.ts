import { Injectable } from '@nestjs/common';
import {WsException} from '@nestjs/websockets';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class GameService {
  private readonly gameCache: Map<string, Game> = new Map();
  private readonly userIdToGame: Map<User, Game> = new Map();
  
  userCreateGame(client: User): string {
    let newGame: Game = new Game();
    
    // If a game with the same id already exists, generate a new game.
    while(this.gameCache.has(newGame.id))
      newGame = new Game();

    this.registerGame(newGame);
    this.joinGame(newGame.id, client);
    newGame.setOwner(client);
    return newGame.id;
  }

  joinGame(gameId: string, player: User) {
    const game: Game = this.gameCache.get(gameId);

    if(!game)
      throw new WsException('Failed to find game by id.');
    if(this.getUsersGame(player))
      throw new WsException('User cannot join more than one game at a time.');

    game.join(player);
    this.registerUserToGame(player, game);
  }

  leavePlay(player: User) {
    const game: Game|undefined = this.getUsersGame(player);

    if(game) {
      this.userIdToGame.delete(player);
      game.leave(player);
    }
  }

  private registerGame(game: Game): void {
    this.gameCache.set(game.id, game);
  }

  private registerUserToGame(player: User, gameId: Game): void {
    this.userIdToGame.set(player, gameId);
  }

  getUsersGame(player: User): Game|undefined {
    return this.userIdToGame.get(player);
  }

  findAll(): string[] {
    return Array.from(this.gameCache.keys());
  }

  findOne(id: string) : Game|undefined {
    return this.gameCache.get(id);
  }

  update(id: number, _: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
