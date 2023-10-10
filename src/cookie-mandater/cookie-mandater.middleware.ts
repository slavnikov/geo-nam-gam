import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CookieMandaterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('Hitting the middleware!!!');
    next();
  }
}
