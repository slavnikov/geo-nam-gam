import { Injectable } from '@nestjs/common';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  readonly gameCache: {[key: string]: Game} = {};
  
  create(): string {
    const newGame: Game = new Game();

    this.gameCache[newGame.id] = newGame;
    return newGame.id;
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
