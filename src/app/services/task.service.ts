import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasksByBoard(boardId: number): Observable<Task[]> {
    return this.http.get<Task[]>(API_ENDPOINTS.tasks.getByBoard(boardId));
  }

  createTask(boardId: number, task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(API_ENDPOINTS.tasks.create(boardId), task);
  }

  updateTask(taskId: number, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(API_ENDPOINTS.tasks.update(taskId), task);
  }

  toggleCheckTask(taskId: number): Observable<Task> {
    return this.http.patch<Task>(API_ENDPOINTS.tasks.toggleCheck(taskId), null);
  }
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.tasks.delete(taskId));
  }
}