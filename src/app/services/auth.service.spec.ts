import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('isLoggedIn returns false when no session', () => {
    const service = new AuthService();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('getToken returns null when no session', () => {
    const service = new AuthService();
    expect(service.getToken()).toBeNull();
  });
});
