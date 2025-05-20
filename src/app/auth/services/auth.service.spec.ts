import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { provideHttpClient} from '@angular/common/http';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../../models/register-request.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const futureExp = Math.floor(Date.now() / 1000) + 60;
  const dummyToken = [
    'header',
    btoa(JSON.stringify({ exp: futureExp })),
    'signature'
  ].join('.');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login() should POST credentials and store token', () => {
    const creds = { email: 'a@b.com', password: '1234' };
    service.login(creds).subscribe(res => {
      expect(res.token).toBe(dummyToken);
      expect(localStorage.getItem('authToken')).toBe(dummyToken);
    });

    const req = httpMock.expectOne(API_ENDPOINTS.auth.login);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(creds);
    req.flush({ token: dummyToken });
  });

  it('logout() should remove token from localStorage', () => {
    localStorage.setItem('authToken', 'foo');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should send POST request to register endpoint', () => {
    const mockRequest: RegisterRequest = {
      email: 'john@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password1'
    };

    service.register(mockRequest).subscribe();

    const req = httpMock.expectOne(API_ENDPOINTS.auth.register);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush({});
  });

  it('isAuthenticated() should return false if no token', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated() should return false if token malformed', () => {
    localStorage.setItem('authToken', 'bad.token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated() should return false if token expired', () => {
    const expired = ['h', btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000) - 60 })), 's'].join('.');
    localStorage.setItem('authToken', expired);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated() should return true if token valid and not expired', () => {
    localStorage.setItem('authToken', dummyToken);
    expect(service.isAuthenticated()).toBeTrue();
  });
});
