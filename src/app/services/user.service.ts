import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User } from '../models/user.model';
import { UserUpdate } from '../models/user-update.model';
import { PasswordUpdate } from '../models/password-update.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.users.getCurrent);
  }

  updateUser(data: UserUpdate): Observable<User> {
    return this.http.patch<User>(API_ENDPOINTS.users.update, data);
  }

  updatePassword(data: PasswordUpdate): Observable<void> {
    return this.http.patch<void>(API_ENDPOINTS.users.updatePassword, data);
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.users.delete}`);
  }
}
