import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { TaskService } from '../../services/task.service';
import { BoardService } from '../../services/board.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { Board } from '../../models/board.model';
import { ElementRef } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let boardServiceSpy: jasmine.SpyObj<BoardService>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', completed: false, items: [] },
    { id: 2, title: 'Task 2', completed: true, items: [] }
  ];

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasksByBoard', 'createTask']);
    boardServiceSpy = jasmine.createSpyObj('BoardService', ['updateBoard', 'deleteBoard', 'notifyBoardDeleted']);

    await TestBed.configureTestingModule({
      imports: [
        BoardComponent,
        FormsModule,
        DragScrollComponent,
        ToastComponent,
        ConfirmDialogComponent
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: BoardService, useValue: boardServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.titleInputRef = new ElementRef(document.createElement('input'));
    component.newTaskInputContainerRef = new ElementRef(document.createElement('div'));
    component.board = { id: 42, title: 'My Board' };
  });

  it('should create and set initial title', () => {
    expect(component).toBeTruthy();
    expect(component.boardTitle).toBe('');
  });

  it('ngOnInit + fetch tasks success', () => {
    taskServiceSpy.getTasksByBoard.and.returnValue(of(mockTasks));
    component.ngOnInit();
    expect(taskServiceSpy.getTasksByBoard).toHaveBeenCalledWith(42);
    expect(component.tasks).toEqual(mockTasks);
    expect(component.loading).toBeFalse();
  });

  it('ngOnInit + fetch tasks error', () => {
    taskServiceSpy.getTasksByBoard.and.returnValue(throwError(() => new Error()));
    component.ngOnInit();
    expect(component.toastMessage).toBe('Failed to load board data.');
    expect(component.toastType).toBe('error');
  });

  it('ngOnChanges should re-fetch tasks', () => {
    taskServiceSpy.getTasksByBoard.and.returnValue(of(mockTasks));
    component.ngOnChanges();
    expect(taskServiceSpy.getTasksByBoard).toHaveBeenCalled();
  });

  it('saveTitleIfChanged: success path', () => {
    component.board.title = 'Old';
    component.originalTitle = 'Old';
    component.boardTitle = 'New';
    boardServiceSpy.updateBoard.and.returnValue(of({ id: 42, title: 'New' } as Board));
    spyOn(component.titleInputRef.nativeElement, 'blur');
    component.saveTitleIfChanged();
    expect(boardServiceSpy.updateBoard).toHaveBeenCalledWith(42, jasmine.objectContaining({ title: 'New' }));
    expect(component.originalTitle).toBe('New');
    expect(component.titleInputRef.nativeElement.blur).toHaveBeenCalled();
  });

  it('saveTitleIfChanged: no-change or empty resets title', () => {
    component.originalTitle = 'X';
    component.boardTitle = '   ';
    component.saveTitleIfChanged();
    expect(component.boardTitle).toBe('X');
  });

  it('saveTitleIfChanged: error path', () => {
    component.originalTitle = 'X';
    component.boardTitle = 'Y';
    boardServiceSpy.updateBoard.and.returnValue(throwError(() => new Error()));
    component.saveTitleIfChanged();
    expect(component.toastMessage).toBe('Failed to update board.');
    expect(component.boardTitle).toBe('X');
  });

  it('cancelEditing should reset title', () => {
    component.originalTitle = 'Orig';
    component.boardTitle = 'Changed';
    component.cancelEditing();
    expect(component.boardTitle).toBe('Orig');
  });

  it('onFocusTitle and onBlurTitle toggles delete button', fakeAsync(() => {
    component.onFocusTitle();
    expect(component.showDeleteButton).toBeTrue();
    component.onBlurTitle();
    tick(200);
    expect(component.showDeleteButton).toBeFalse();
  }));

  it('deleteBoard success path via confirm', () => {
    component.board = { id: 5, title: 'B' };
    boardServiceSpy.deleteBoard.and.returnValue(of(undefined));
    spyOn(component, 'openConfirm').and.callThrough();
    component.deleteBoard();
    expect(component.openConfirm).toHaveBeenCalled();
    component.confirmAction();
    expect(boardServiceSpy.notifyBoardDeleted).toHaveBeenCalled();
  });

  it('deleteBoard error path', () => {
    boardServiceSpy.deleteBoard.and.returnValue(throwError(() => new Error()));
    component.deleteBoard();
    component.confirmAction();
    expect(component.toastMessage).toBe('Failed to delete board.');
  });

  it('onNewTaskInputFocus/Blur placeholder behavior', () => {
    component.onNewTaskInputFocus();
    expect(component.newTaskPlaceholder).toBe('Enter task name');
    component.newTaskName = 'foo';
    component.onNewTaskInputBlur();
    expect(component.newTaskName).toBe('');
    expect(component.newTaskPlaceholder).toBe('New Task...');
  });

  it('handleTaskCreationAttempt: success & empty', () => {
    component.board = { id: 7, title: 'T' };
    component.newTaskName = 'A';
    taskServiceSpy.createTask.and.returnValue(of({ id: 9, title: 'A', completed: false, items: [] }));
    component.handleTaskCreationAttempt();
    expect(component.tasks[0].id).toBe(9);
    component.newTaskName = '   ';
    component.handleTaskCreationAttempt();
    expect(taskServiceSpy.createTask.calls.count()).toBe(1);
  });

  it('handleTaskCreationAttempt: error path', fakeAsync(() => {
    component.newTaskName = 'B';
    taskServiceSpy.createTask.and.returnValue(throwError(() => new Error()));
    component.handleTaskCreationAttempt();
    tick();
    expect(component.toastMessage).toBe('Error creating task');
  }));

  it('onTaskDeleted filters out the task', () => {
    component.tasks = [...mockTasks];
    component.onTaskDeleted(1);
    expect(component.tasks.find(t => t.id === 1)).toBeUndefined();
  });

});
