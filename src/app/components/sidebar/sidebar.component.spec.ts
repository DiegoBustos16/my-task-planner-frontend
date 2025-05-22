import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { BoardService } from '../../services/board.service';
import { of, throwError } from 'rxjs';
import { Board } from '../../models/board.model';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let boardServiceSpy: jasmine.SpyObj<BoardService>;

  const mockBoards: Board[] = [
    { id: 1, boardName: 'Board 1' },
    { id: 2, boardName: 'Board 2' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BoardService', ['getBoards', 'createBoard']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: BoardService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    boardServiceSpy = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch boards on init', () => {
    boardServiceSpy.getBoards.and.returnValue(of({ boards: mockBoards, totalPages: 2 }));

    component.ngOnInit();

    expect(boardServiceSpy.getBoards).toHaveBeenCalledWith(1);
    expect(component.boards.length).toBe(2);
    expect(component.totalPages).toBe(2);
  });

  it('should handle error on fetchBoards', () => {
    spyOn(console, 'error');
    boardServiceSpy.getBoards.and.returnValue(throwError(() => new Error('Fetch error')));

    component.fetchBoards();

    expect(console.error).toHaveBeenCalledWith('Error fetching boards:', jasmine.any(Error));
  });

  it('should go to next page if current page < totalPages', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    boardServiceSpy.getBoards.and.returnValue(of({ boards: mockBoards, totalPages: 3 }));

    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(boardServiceSpy.getBoards).toHaveBeenCalledWith(2);
  });

  it('should not go to next page if current page === totalPages', () => {
    component.currentPage = 3;
    component.totalPages = 3;

    component.nextPage();

    expect(component.currentPage).toBe(3);
  });

  it('should go to previous page if current page > 1', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    boardServiceSpy.getBoards.and.returnValue(of({ boards: mockBoards, totalPages: 3 }));

    component.prevPage();

    expect(component.currentPage).toBe(1);
    expect(boardServiceSpy.getBoards).toHaveBeenCalledWith(1);
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
    boardServiceSpy.createBoard.and.returnValue(of({ id: 3, boardName: 'New Board' }));
    boardServiceSpy.getBoards.and.returnValue(of({ boards: mockBoards, totalPages: 2 }));

    component.newBoardName = 'New Board';
    component.handleBoardCreationAttempt();

    expect(boardServiceSpy.createBoard).toHaveBeenCalledWith({ boardName: 'New Board' });
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
    const board: Board = { id: 1, boardName: 'Test Board' };
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
});
