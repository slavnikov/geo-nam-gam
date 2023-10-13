import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CookieMandaterMiddleware } from './cookie-mandater/cookie-mandater.middleware';
import { GameModule } from './game/game.module';
import { PlayModule } from './play/play.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GameModule,
    PlayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieMandaterMiddleware)
        .forRoutes('*')
  }
}
