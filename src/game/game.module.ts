import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import {PlayGateway} from './play.gateway';
import {UserModule} from '../user/user.module';

@Module({
  controllers: [GameController],
  providers: [GameService, PlayGateway],
  imports: [UserModule]
})
export class GameModule {}
