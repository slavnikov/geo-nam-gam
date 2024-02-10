import { CookieMandaterMiddleware } from './cookie-mandater.middleware';
import { Request, Response } from 'express';

describe('CookieMandaterMiddleware', () => {
  const cookieMandater = new CookieMandaterMiddleware();
  const mockCookieVal = 'abc-123';
  const cookieIdKey = 'cookie_id';
  const guidRegex = '^({)?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}(}?)$';

  let cookieSetter_mock: () => any;
  const req_mock = {signedCookies: {}} as Request;
  const res_mock = {} as any as Response;
  const nextFun_mock = () => {};

  beforeEach(() => {
    cookieSetter_mock = jest.fn();
    res_mock.cookie = cookieSetter_mock;
  });

  it('should be defined', () => {
    expect(new CookieMandaterMiddleware()).toBeDefined();
  });

  it('should always set a cookie into the response object', () => {
    cookieMandater.use(req_mock, res_mock, nextFun_mock);
    expect(cookieSetter_mock)
      .toHaveBeenCalledTimes(1);
  });

  it('should generate new guid if request cookies is missing id', () => {
    cookieMandater.use(req_mock, res_mock, nextFun_mock);
    expect(cookieSetter_mock)
      .toHaveBeenCalledTimes(1);
    expect(cookieSetter_mock)
      .toHaveBeenCalledWith(cookieIdKey, expect.stringMatching(guidRegex), {signed: true});
  });

  it('should place the id from the request cookie back into the response', () => {
    req_mock.signedCookies.cookie_id = mockCookieVal;
    cookieMandater.use(req_mock, res_mock, nextFun_mock);
    expect(cookieSetter_mock)
      .toHaveBeenCalledTimes(1);
    expect(cookieSetter_mock)
      .toHaveBeenCalledWith(cookieIdKey, mockCookieVal, {signed: true});
  });
});
