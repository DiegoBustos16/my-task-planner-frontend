import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('AuthInterceptor (unit test)', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        AuthInterceptor
      ]
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should add Authorization header when token present', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue('my-token');

    const req = new HttpRequest('GET', '/path');

    const next: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        expect(r.headers.has('Authorization')).toBeTrue();
        expect(r.headers.get('Authorization')).toBe('Bearer my-token');
        return of({} as HttpEvent<any>);
      }
    };

    interceptor.intercept(req, next).subscribe({
      complete: () => done()
    });
  });

  it('should not add Authorization header when no token', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const req = new HttpRequest("GET", '/any');
    const next: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        expect(r.headers.has('Authorization')).toBeFalse();
        return of({} as HttpEvent<any>);
      }
    };
    interceptor.intercept(req, next).subscribe({
      complete: () => done()
    });
  });
});
