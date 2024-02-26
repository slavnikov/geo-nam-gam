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

  static removeNonASCIIChars(cookie: string): string {
    let resCookie: string = cookie;
    let percentIdx: number = resCookie.indexOf('%');

    while(percentIdx > -1) {
      const charCode: string = '0x' + resCookie.substring(percentIdx + 1, percentIdx + 3);
      const codeNum: number = Number.parseInt(charCode);
      const trueChar: string = String.fromCharCode(codeNum);

      resCookie = resCookie.substring(0, percentIdx) + trueChar + resCookie.substring(percentIdx + 3);
      percentIdx = resCookie.indexOf('%');
    }

    return resCookie;
  }
}
