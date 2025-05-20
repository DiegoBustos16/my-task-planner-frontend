import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegisterRequest } from '../../models/register-request.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { LoginRequest } from '../../models/login-request.model';
import { AuthResponse } from '../../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ENDPOINTS.auth.login}`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ENDPOINTS.auth.register}`, request).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }


  isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    if (!expiry) return false;

    const now = Math.floor(Date.now() / 1000);
    return expiry > now;
  } catch {
    return false;
  }
}

}

