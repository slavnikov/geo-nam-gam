import { CookieUtil } from './cookie-util';

describe('CookieUtil', () => {
  const rawCookieVal = 's%3A8c48fcfa-065e-4955-a61a-e43613015f12.A1qK%2BSYNy%2F83y0GT3J1cJvu09fwp63aXLsI%2FUk0z2G8';

  it('should be able to remove non ASCII chars from a cookie', () => {
    const testCookie: string = CookieUtil.removeNonASCIIChars(rawCookieVal);
    const goodCookie: string = 's:8c48fcfa-065e-4955-a61a-e43613015f12.A1qK+SYNy/83y0GT3J1cJvu09fwp63aXLsI/Uk0z2G8'

    expect(testCookie).toEqual(goodCookie);
  });

  it('should be able to extract a signed value froma raw cookie', () => {
    const rawCookie: string = ` cookie_id = ${rawCookieVal} ; foo = bar;`;
    const trueCookieVal:string = '8c48fcfa-065e-4955-a61a-e43613015f12';
    const testCookieVal:string|false = CookieUtil.extractSignedCookie(rawCookie, 'cookie_id', 'T3$+_3^/v')

    expect(testCookieVal).toEqual(trueCookieVal);
  });

  it('should return false if the cookie value has been tampered with', () => {
    const tamperedCookie1: string = rawCookieVal.replace('A1q', 'B2w');
    const tamperedCookie2: string = rawCookieVal.replace('065e', 'else');
    const rawCookie1: string = ` cookie_id = ${tamperedCookie1} ; foo = bar;`;
    const rawCookie2: string = ` cookie_id = ${tamperedCookie2} ; foo = bar;`;
    const testCookieVal1:string|false = CookieUtil.extractSignedCookie(rawCookie1, 'cookie_id', 'T3$+_3^/v');
    const testCookieVal2:string|false = CookieUtil.extractSignedCookie(rawCookie2, 'cookie_id', 'T3$+_3^/v');

    expect(testCookieVal1).toStrictEqual(false);
    expect(testCookieVal2).toStrictEqual(false);
  });

  it('should return false if the signature has been removed', () => {
    const unsignedCookie:string = '8c48fcfa-065e-4955-a61a-e43613015f12';
    const rawCookie: string = ` cookie_id = ${unsignedCookie} ; foo = bar;`;
    const rawCookie2: string = ` cookie_id = ${unsignedCookie.substring(4)} ; foo = bar;`;
    const testCookieVal:string|false = CookieUtil.extractSignedCookie(rawCookie, 'cookie_id', 'T3$+_3^/v')
    const testCookieVal2:string|false = CookieUtil.extractSignedCookie(rawCookie2, 'cookie_id', 'T3$+_3^/v')

    expect(testCookieVal).toStrictEqual(false);
    expect(testCookieVal2).toStrictEqual(false);
  });
});
