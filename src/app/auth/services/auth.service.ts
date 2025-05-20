import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegisterRequest } from '../../models/register-request.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { LoginRequest } from '../../models/login-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_ENDPOINTS.auth.login}`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.auth.register}`, request);
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

