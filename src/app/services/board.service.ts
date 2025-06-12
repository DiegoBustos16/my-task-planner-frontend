// src/app/services/board.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Board } from '../models/board.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {}

  private boardDeletedSource = new Subject<void>();
  boardDeleted$ = this.boardDeletedSource.asObservable();

  notifyBoardDeleted() {
    this.boardDeletedSource.next();
  }

  getBoards(page: number, size: number): Observable<{ content: Board[]; totalPages: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: Board[]; totalPages: number }>(API_ENDPOINTS.boards.getAll, { params });
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    return this.http.post<Board>(API_ENDPOINTS.boards.create, board);
  }

  updateBoard(boardId: number, board: Partial<Board>): Observable<Board> {
    return this.http.patch<Board>(API_ENDPOINTS.boards.update(boardId), board);
  }

  deleteBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.boards.delete(boardId));
  }
}
