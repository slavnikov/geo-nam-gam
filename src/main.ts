import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {WsAdapter} from '@nestjs/platform-ws';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(3000);
}
bootstrap();
