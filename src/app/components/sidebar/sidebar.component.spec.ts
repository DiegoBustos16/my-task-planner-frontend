import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { BoardService } from '../../services/board.service';
import { of, throwError } from 'rxjs';
import { Board } from '../../models/board.model';
import { UserService } from '../../services/user.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let boardServiceSpy: jasmine.SpyObj<BoardService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockBoards: Board[] = [
    { id: 1, title: 'Board 1' },
    { id: 2, title: 'Board 2' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BoardService', ['getBoards', 'createBoard']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: BoardService, useValue: spy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    boardServiceSpy = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch boards on calculateAndFetchBoards()', () => {
    boardServiceSpy.getBoards.and.returnValue(of({ content: [{ id: 1, title: 'Board 1' }], totalPages: 1 }));
    component.calculateAndFetchBoards();
    expect(component.boards.length).toBe(1);
  });

  it('should handle error on fetchBoards', () => {
    boardServiceSpy.getBoards.and.returnValue(throwError(() => new Error('Fetch error')));

    component.fetchBoards(null, 1);

    expect(component.toastMessage).toBe('Error getting boards');
    expect(component.toastType).toBe('error');
  });

  it('should go to next page if current page < totalPages', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    boardServiceSpy.getBoards.and.returnValue(of({ content: mockBoards, totalPages: 3 }));

    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(boardServiceSpy.getBoards).toHaveBeenCalledWith(1, jasmine.anything());
  });

  it('should not go to next page if current page === totalPages', () => {
    component.currentPage = 3;
    component.totalPages = 3;

    component.nextPage();

    expect(component.currentPage).toBe(3);
  });

  it('should go to previous page if current page > 0', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    boardServiceSpy.getBoards.and.returnValue(of({ content: mockBoards, totalPages: 3 }));

    component.prevPage();

    expect(component.currentPage).toBe(1);
    expect(boardServiceSpy.getBoards).toHaveBeenCalledWith(0, jasmine.anything());
  });

  it('should not go to previous page if current page === 1', () => {
    component.currentPage = 1;

    component.prevPage();

    expect(component.currentPage).toBe(1);
  });

  it('should collapse when clicking outside', () => {
    const event = new MouseEvent('click');
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(false);

    component.isCollapsed = false;
    component.onDocumentClick(event);

    expect(component.isCollapsed).toBeTrue();
    expect(component.newBoardName).toBe('');
    expect(component.newBoardPlaceholder).toBe('New Board...');
  });

  it('should un-collapse if clicking inside when collapsed', () => {
    const event = new MouseEvent('click');
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(true);

    component.isCollapsed = true;
    component.onDocumentClick(event);

    expect(component.isCollapsed).toBeFalse();
  });

  it('should change placeholder on input focus', () => {
    component.isCollapsed = false;

    component.onNewBoardInputFocus();

    expect(component.newBoardPlaceholder).toBe('Enter board name');
  });

  it('should create board if input is valid', () => {
    boardServiceSpy.createBoard.and.returnValue(of({ id: 3, title: 'New Board' }));
    boardServiceSpy.getBoards.and.returnValue(of({ content: mockBoards, totalPages: 2 }));

    component.newBoardName = 'New Board';
    component.handleBoardCreationAttempt();

    expect(boardServiceSpy.createBoard).toHaveBeenCalledWith({ title: 'New Board' });
    expect(boardServiceSpy.getBoards).toHaveBeenCalled();
    expect(component.newBoardName).toBe('');
    expect(component.newBoardPlaceholder).toBe('New Board...');
  });

  it('should not create board if input is empty or whitespace', () => {
    component.newBoardName = '   ';

    component.handleBoardCreationAttempt();

    expect(boardServiceSpy.createBoard).not.toHaveBeenCalled();
  });

  it('should emit board when selected', () => {
    const board: Board = { id: 1, title: 'Test Board' };
    spyOn(component.boardSelected, 'emit');

    component.selectBoard(board);

    expect(component.selectedBoard).toBe(board);
    expect(component.boardSelected.emit).toHaveBeenCalledWith(board);
    expect(component.newBoardName).toBe('');
    expect(component.newBoardPlaceholder).toBe('New Board...');
  });

  it('should return user initial in uppercase', () => {
    component.userName = 'diego';
    expect(component.getInitial()).toBe('D');
  });

  it('should fetch user on init', () => {
    userServiceSpy.getUser.and.returnValue(of({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', name: 'Jane' }));
    boardServiceSpy.getBoards.and.returnValue(of({ content: mockBoards, totalPages: 1 }));
    boardServiceSpy.boardDeleted$ = of();

    component.ngOnInit();

    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.userName).toBe('Jane Doe');
  });

  it('should handle error on fetchUser', () => {
    userServiceSpy.getUser.and.returnValue(throwError(() => new Error('User error')));

    component.fetchUser();

    expect(component.toastMessage).toBe('Error getting user');
    expect(component.toastType).toBe('error');
  });

  it('should handle error on createBoard', fakeAsync(() => {
    component.newBoardName = 'Board With Error';
    boardServiceSpy.createBoard.and.returnValue(throwError(() => new Error('Create error')));

    component.handleBoardCreationAttempt();
    tick();

    expect(component.toastMessage).toBe('Error creating board');
    expect(component.toastType).toBe('error');
  }));

  it('should reset selectedBoard when selecting new board', () => {
    const board1: Board = { id: 1, title: 'First' };
    const board2: Board = { id: 2, title: 'Second' };
    spyOn(component.boardSelected, 'emit');

    component.selectBoard(board1);
    component.selectBoard(board2);

    expect(component.selectedBoard).toBe(board2);
    expect(component.boardSelected.emit).toHaveBeenCalledWith(board2);
  });

  it('should not un-collapse if clicking inside while not collapsed', () => {
    const event = new MouseEvent('click');
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(true);

    component.isCollapsed = false;
    component.onDocumentClick(event);

    expect(component.isCollapsed).toBeFalse();
  });

});
