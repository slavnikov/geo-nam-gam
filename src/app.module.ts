import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CookieMandaterMiddleware } from './cookie-mandater/cookie-mandater.middleware';
import { GameModule } from './game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // set the path of the static files to be served
      rootPath: join(__dirname, '..', 'public'),
    }),
    // allow the access of env variables by the app
    ConfigModule.forRoot(),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // apply the middleware to all routes
      .apply(CookieMandaterMiddleware)
        .forRoutes('*')
  }
}
