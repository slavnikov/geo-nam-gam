import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {WsAdapter} from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
import {INestApplication} from '@nestjs/common';
import {RequestHandler} from 'express';

async function bootstrap() {
  const nestApp : INestApplication = await NestFactory.create(AppModule);
  const wsAdapter : WsAdapter  = new WsAdapter(nestApp);
  const envCookieSecret : string | undefined = process.env.COOKIE_SECRET;

  if(!envCookieSecret)
    throw new Error('Cannot start server without COOKIE_SECRET environment variable set.');

  const requestCookieParser : RequestHandler = cookieParser(envCookieSecret);

  nestApp.useWebSocketAdapter(wsAdapter);
  nestApp.use(requestCookieParser);
  await nestApp.listen(3000);
}
bootstrap();
