import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import {PlayGateway} from './play.gateway';

@Module({
  controllers: [GameController],
  providers: [GameService, PlayGateway],
})
export class GameModule {}
