import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ToastComponent } from '../toast/toast.component';

const NEW_BOARD_PLACEHOLDER_DEFAULT = 'New Board...';
const NEW_BOARD_PLACEHOLDER_FOCUSED = 'Enter board name';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  @Output() boardSelected = new EventEmitter<Board>();
  @Output() toggleUserPanel = new EventEmitter<void>();


  userName: string = 'User Name';
  boards: Board[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  isCollapsed: boolean = false;
  newBoardName: string = '';
  selectedBoard: Board | null = null;

  newBoardPlaceholder: string = NEW_BOARD_PLACEHOLDER_DEFAULT;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchBoards();
    this.fetchUser();
  }

  getInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  fetchBoards(): void {
    this.boardService.getBoards(this.currentPage).subscribe({
      next: ({ boards, totalPages }) => {
        this.boards = boards;
        this.totalPages = totalPages;
      },
      error: (err) => {
        this.showToast('Error getting boards', 'error');
      }
    });
  }

  fetchUser(): void {
    this.userService.getUser().subscribe({
      next: user => {
        this.userName = user.firstName + ' ' + user.lastName;
      },
      error: (err) => {
        this.showToast('Error getting user', 'error');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchBoards();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchBoards();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (this.isCollapsed) {
      if (clickedInside) {
        this.isCollapsed = false;
      }
    } else {
      if (!clickedInside) {
        this.isCollapsed = true;
        this.newBoardName = '';
        this.newBoardPlaceholder = NEW_BOARD_PLACEHOLDER_DEFAULT;
      }
    }
  }

  onNewBoardInputFocus(): void {
    if (!this.isCollapsed) {
      this.newBoardPlaceholder = NEW_BOARD_PLACEHOLDER_FOCUSED;
    }
  }

  handleBoardCreationAttempt(): void {
    const trimmedName = this.newBoardName.trim();

    if (trimmedName) {
      this.boardService.createBoard({ boardName: trimmedName }).subscribe({
        next: created => {
          this.fetchBoards();
        },
        error: err => {
          this.showToast('Error creating board', 'error');
        }
      });
    }

    this.newBoardName = '';
    this.newBoardPlaceholder = NEW_BOARD_PLACEHOLDER_DEFAULT;
  }

  selectBoard(board: Board): void {
    this.selectedBoard = board;
    this.boardSelected.emit(board);
    this.newBoardName = '';
    this.newBoardPlaceholder = NEW_BOARD_PLACEHOLDER_DEFAULT;
  }
}
