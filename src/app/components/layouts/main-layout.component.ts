import { Component, ElementRef, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Board } from "../../models/board.model";
import { UserManagementComponent } from "../user-management/user-management.component";
import { BoardComponent } from '../board/board.component';
import { DragScrollComponent, DragScrollItemDirective} from 'ngx-drag-scroll';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone: true,
  imports: [SidebarComponent, UserManagementComponent, BoardComponent, RouterModule, CommonModule, DragScrollComponent, DragScrollItemDirective],
})
export class MainLayoutComponent {

  constructor(private boardService: BoardService) {}

  selectedBoard: Board | null = null;
  showUserPanel: boolean = false;

  ngOnInit(): void {
    this.boardService.boardDeleted$.subscribe(() => {
      this.selectedBoard = null;
    });
  }

  setSelectedBoard(board: Board) {
    this.showUserPanel = false;
    this.selectedBoard = board;
  }

  toggleUserPanel(): void {
    this.showUserPanel = !this.showUserPanel;
  }

  selectedBoardId(): number | null {
    return this.selectedBoard ? this.selectedBoard.id : null;
  }

}