// src/app/services/board.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {}

  getBoards(page: number, size: number): Observable<{ content: Board[]; totalPages: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: Board[]; totalPages: number }>(API_ENDPOINTS.boards.getAll, { params });
  }


  createBoard(board: Partial<Board>): Observable<Board> {
    return this.http.post<Board>(API_ENDPOINTS.boards.create, board);
  }

  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(API_ENDPOINTS.boards.getById(id));
  }
}
