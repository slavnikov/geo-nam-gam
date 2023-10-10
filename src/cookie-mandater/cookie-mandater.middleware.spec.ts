import { CookieMandaterMiddleware } from './cookie-mandater.middleware';

describe('CookieMandaterMiddleware', () => {
  it('should be defined', () => {
    expect(new CookieMandaterMiddleware()).toBeDefined();
  });
});
