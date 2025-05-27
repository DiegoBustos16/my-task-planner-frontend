import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User } from '../models/user.model'; // Assuming you have a User model defined

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.users.getCurrent);
  }
}
