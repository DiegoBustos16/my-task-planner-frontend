import { CommonModule } from '@angular/common';
import { Component, ElementRef , HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { BoardService } from '../../services/board.service';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

const NEW_TASK_PLACEHOLDER_DEFAULT = 'New Task...';
const NEW_TASK_PLACEHOLDER_FOCUSED = 'Enter task name';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskComponent, DragScrollComponent, FormsModule, ToastComponent, ConfirmDialogComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;

  @ViewChild('titleInputRef') titleInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('newTaskInputContainer') newTaskInputContainerRef!: ElementRef;

  tasks: Task[] = [];
  loading = true;

  showDeleteButton = false;
  private blurTimeout: any;

  boardTitle: string = '';
  originalTitle: string = '';

  newTaskName: string = '';
  newTaskPlaceholder: string = NEW_TASK_PLACEHOLDER_DEFAULT;

  showConfirm = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private taskService: TaskService, private boardService: BoardService) {}

  ngOnInit(): void {
    this.fetchTasks();
    this.boardTitle = this.board.title;
    this.originalTitle = this.boardTitle;
  }

  ngOnChanges(): void {
    if (this.board) {
      this.fetchTasks();
      this.boardTitle = this.board.title;
      this.originalTitle = this.boardTitle;
    }
  }

  private fetchTasks(): void {
    this.loading = true;

    this.taskService.getTasksByBoard(this.board.id).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.showToast('Failed to load board data.', 'error');
        this.tasks = [];
        this.loading = false;
      }
    });
  }

  saveTitleIfChanged(): void {
    const trimmedTitle = this.boardTitle.trim();
    if (trimmedTitle && trimmedTitle !== this.originalTitle) {
      const updateBoard: Board = {
        title: trimmedTitle,
        id: this.board.id,
      };
      this.boardService.updateBoard(this.board.id, updateBoard).subscribe({
        next: () => {
        this.board.title = trimmedTitle;
        this.originalTitle = trimmedTitle;
        this.titleInputRef.nativeElement.blur();
        },
        error: () => {
          this.showToast('Failed to update board.', 'error');
          this.boardTitle = this.originalTitle;
        }
      });
    } else {
      this.boardTitle = this.originalTitle;
    }
  }

  cancelEditing(): void {
    this.boardTitle = this.originalTitle;
  }

  onFocusTitle() {
    clearTimeout(this.blurTimeout);
    this.showDeleteButton = true;
  }

  onBlurTitle() {
    this.blurTimeout = setTimeout(() => {
      this.showDeleteButton = false;
    }, 200);
  }

  openConfirm(message: string, action: () => void) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirm = true;
  }

  handleConfirm() {
    this.showConfirm = false;
    this.confirmAction();
  }

  handleCancel() {
    this.showConfirm = false;
  }

  deleteBoard(): void {
    this.openConfirm('Are you sure you want to delete this board?', () => {
      this.boardService.deleteBoard(this.board.id).subscribe({
        next: () => {
          this.boardService.notifyBoardDeleted();
        },
        error: (err) => {
          this.showToast('Failed to delete board.', 'error');
        }
      });
    });
  }

  onNewTaskInputFocus(): void {
      this.newTaskPlaceholder = NEW_TASK_PLACEHOLDER_FOCUSED;
  }

  onNewTaskInputBlur(): void {
    this.newTaskName = '';
    this.newTaskPlaceholder = NEW_TASK_PLACEHOLDER_DEFAULT;
  }

  handleTaskCreationAttempt(): void {
    const trimmedName = this.newTaskName.trim();
    const createdTask: Task = {
        title: trimmedName,
        id: this.board.id,
        completed:false,
        items: []
      };
    if (trimmedName) {
      this.taskService.createTask(this.board.id, createdTask).subscribe({
        next: created => {
          this.tasks.unshift(created)
          this.onNewTaskInputBlur()
        },
        error: () => {
          this.showToast('Error creating task', 'error');
        }
      });
    }
  }

  onTaskDeleted(taskId: number): void {
  this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.titleInputRef &&
      !this.titleInputRef.nativeElement.contains(event.target as Node)
    ) {
      this.cancelEditing();
    }
  }
}

