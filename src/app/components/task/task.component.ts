import { CommonModule } from '@angular/common';
import { Component, Input , ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList  } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ItemService } from '../../services/item.service';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ItemRequest } from '../../models/item-request.model';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule , ToastComponent , ConfirmDialogComponent, FormsModule],
  templateUrl: './task.component.html'
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();

  @ViewChild('taskContainer') taskContainer!: ElementRef;
  @ViewChild('titleInputTask') titleInputTask!: ElementRef<HTMLTextAreaElement>;
  @ViewChildren('titleInputItem') titleInputItems!: QueryList<ElementRef<HTMLTextAreaElement>>;


  isFocused = false;

  taskTitle: string = '';
  originalTitle: string = '';

  newItemTitle = '';

  editableTitles: Record<number, string> = {};

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showConfirm = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  constructor(private taskService: TaskService, private itemService: ItemService) {}

  ngOnInit(): void {
    this.taskTitle = this.task.title;
    this.originalTitle = this.taskTitle;
    this.task.items.forEach(item => {
      this.editableTitles[item.id] = item.title;
    });
  }

  ngAfterViewInit(): void {
    if (this.titleInputTask && this.titleInputTask.nativeElement) {
      this.autoGrow({ target: this.titleInputTask.nativeElement } as unknown as Event);
    }

    setTimeout(() => this.titleInputItems?.forEach(itemRef => {
      this.autoGrow({ target: itemRef.nativeElement } as unknown as Event);
    })
    , 10);
  }

  focusInContainer(): void {
    this.isFocused=true;

    if (this.titleInputTask && this.titleInputTask.nativeElement) {
      this.autoGrow({ target: this.titleInputTask.nativeElement } as unknown as Event);
    }

    setTimeout(() => this.titleInputItems?.forEach(itemRef => {
      this.autoGrow({ target: itemRef.nativeElement } as unknown as Event);
    })
    , 10);
  }

  focusOutContainer(): void {
    this.isFocused=false;

    if (this.titleInputTask && this.titleInputTask.nativeElement) {
      this.autoGrow({ target: this.titleInputTask.nativeElement } as unknown as Event);
    }

    setTimeout(() => this.titleInputItems?.forEach(itemRef => {
      this.autoGrow({ target: itemRef.nativeElement } as unknown as Event);
    })
    , 10);
  }

  getTaskClasses(task: Task, isFocused: boolean): { [klass: string]: boolean } {
    return {
      'border-lightblue': !task.completed,
      'border-green-400 border-2': task.completed,
    };
  }
    
  onEnter(event: Event): void {
    (event as KeyboardEvent).preventDefault();
    this.saveTitleIfChanged();
    setTimeout(() => this.autoGrow({ target: this.titleInputTask.nativeElement } as unknown as Event), 100);
  }

  onBlurTitle() {
    this.taskTitle = this.originalTitle;
    setTimeout(() => this.autoGrow({ target: this.titleInputTask.nativeElement } as unknown as Event), 100);
  }

  autoGrow(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
  }

  saveTitleIfChanged(): void {
    const trimmedTitle = this.taskTitle.trim();
    if (trimmedTitle && trimmedTitle !== this.originalTitle) {
      const updateTask: Task = {
        title: trimmedTitle,
        id: this.task.id,
        completed: this.task.completed,
        items: this.task.items
      };
      this.taskService.updateTask(this.task.id, updateTask).subscribe({
        next: () => {
        this.task.title = trimmedTitle;
        this.originalTitle = trimmedTitle;
        this.titleInputTask.nativeElement.blur();
        },
        error: () => {
          this.showToast('Failed to update task.', 'error');
          this.taskTitle = this.originalTitle;
        }
      });
    } else {
      this.taskTitle = this.originalTitle;
    }
  }

  deleteTask(): void {
    this.openConfirm('Are you sure you want to delete this task?', () => {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.taskDeleted.emit(this.task.id);
        },
        error: () => {
          this.showToast('Failed to delete task.', 'error');
        }
      });
    });
  }

  toggleCheckTask(): void {
      this.taskService.toggleCheckTask(this.task.id).subscribe({
        next: updated => {
          this.task=updated
        },
        error: () => {
          this.showToast('Failed to complete task.', 'error');
        }
      });
  }

  createItem() {
    const newItemtitleTrimmed = this.newItemTitle.trim();
    if (!newItemtitleTrimmed) return;
    const createItemRequest: ItemRequest = {
      title:newItemtitleTrimmed,
    }
    this.itemService.createItem(this.task.id, createItemRequest).subscribe({
      next: createdItem => {
          this.task=createdItem
          const newItem = this.task.items[this.task.items.length - 1];
          this.editableTitles[newItem.id] = newItem.title;
          this.newItemTitle = '';
        },
      error: () => {
        this.showToast('Error adding item.', 'error');
      }
    });
  }

  onEnterItem(event: Event, item: Item): void {
    (event as KeyboardEvent).preventDefault();
    this.saveItemTitleIfChanged(item);
    this.focusOutContainer();
  }

  onBlurItem(item: Item) {
    this.editableTitles[item.id] = item.title;
  }

  saveItemTitleIfChanged(item: Item): void {
    const trimmedTitle = this.editableTitles[item.id].trim();
    const original = item.title.trim();

    if (trimmedTitle && trimmedTitle !== original) {
      const updatedItem: ItemRequest = {
        title: trimmedTitle
      };
      this.itemService.updateItem(item.id, updatedItem).subscribe({
        next: updatedTask => {
            this.task = updatedTask;
            setTimeout(() => this.editableTitles[item.id] = trimmedTitle, 10);
        },
        error: () => {
          this.showToast('Failed to update item title.', 'error');
          this.editableTitles[item.id] = item.title;
        }
      });
    } else {
      this.editableTitles[item.id] = item.title;
    }
  }

   toggleItemCheck(item: Item): void {
      this.itemService.toggleCheckItem(item.id).subscribe({
        next: updated => {
          this.task=updated
        },
        error: () => {
          this.showToast('Failed to complete item.', 'error');
        }
      });
  }

  deleteItem(itemId:number): void {
    this.openConfirm('Are you sure you want to delete this item?', () => {
      this.itemService.deleteItem(itemId).subscribe({
        next: updatedTaskWithDeletedItem => {
          this.task=updatedTaskWithDeletedItem
          setTimeout(() => {
            this.taskContainer?.nativeElement?.focus();
          });
        },
        error: () => {
          this.showToast('Failed to delete item.', 'error');
        }
      });
    });
  }

  getSortedItemsDesc() {
    return [...this.task.items].sort((a, b) => b.id - a.id);
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

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }


}

