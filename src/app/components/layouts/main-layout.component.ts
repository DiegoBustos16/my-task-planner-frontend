import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Board } from "../../models/board.model";
import { UserManagementComponent } from "../user-management/user-management.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone: true,
  imports: [SidebarComponent, UserManagementComponent, RouterModule, CommonModule],
})
export class MainLayoutComponent {
  selectedBoard: Board | null = null;
  showUserPanel: boolean = false;

  setSelectedBoard(board: Board) {
    this.showUserPanel = false;
    this.selectedBoard = board;
  }

  toggleUserPanel(): void {
    this.showUserPanel = !this.showUserPanel;
    if (this.showUserPanel) {
      this.selectedBoard = null;
    }
  }

  selectedBoardId(): number | null {
    return this.selectedBoard ? this.selectedBoard.id : null;
  }
}