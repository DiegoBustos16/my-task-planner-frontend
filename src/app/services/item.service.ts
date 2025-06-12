import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ItemRequest } from '../models/item-request.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) {}

  createItem(taskId: number, item: ItemRequest): Observable<Task> {
    return this.http.post<Task>(API_ENDPOINTS.items.create(taskId), item);
  }

 updateItem(itemId: number, item: ItemRequest): Observable<Task> {
    return this.http.patch<Task>(API_ENDPOINTS.items.update(itemId), item);
  }

  toggleCheckItem(itemId: number): Observable<Task> {
    return this.http.patch<Task>(API_ENDPOINTS.items.toggleCheck(itemId),null);
  }

  deleteItem(itemId: number): Observable<Task> {
    return this.http.delete<Task>(API_ENDPOINTS.items.delete(itemId));
  }
}