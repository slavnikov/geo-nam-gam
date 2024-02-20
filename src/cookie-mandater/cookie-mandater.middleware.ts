import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 } from 'uuid';

@Injectable()
export class CookieMandaterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    const cookieId: string = this.getCookieId(req);

    res.cookie('cookie_id', cookieId, {signed: true})
    next();
  }

  private getCookieId(req: Request): string {
    const cookieId: string = req.signedCookies['cookie_id'];

    return cookieId || v4();
  }
}
