import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authInterceptor: AuthInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({});
        authInterceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });
});
