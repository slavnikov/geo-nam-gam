import * as cookieParser from 'cookie-parser';

export class CookieUtil {
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

  static extractSignedCookie(rawCookie:string, cookieKey:string, secretKey:string): string|false {
    const cookies: string[] = rawCookie.split('; ');
    const neededCookie: string|false = cookies.find(cookie => cookie.trim().startsWith(cookieKey));
    const cookieRawVal: string|false = neededCookie && neededCookie.split('=')[1].trim();
    const cookieValAndSign: string|false = cookieRawVal && this.removeNonASCIIChars(cookieRawVal);
    const cookieVal: string|false = cookieValAndSign && cookieParser.signedCookie(cookieValAndSign, secretKey);

    return cookieVal !== cookieValAndSign && cookieVal;
  }
}
