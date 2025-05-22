import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Board } from "../../models/board.model";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone: true,
  imports: [SidebarComponent, RouterModule, CommonModule],
})
export class MainLayoutComponent {
  selectedBoard: Board | null = null;

  setSelectedBoard(board: Board) {
    this.selectedBoard = board;
  }

  selectedBoardId(): number | null {
    return this.selectedBoard ? this.selectedBoard.id : null;
  }
}