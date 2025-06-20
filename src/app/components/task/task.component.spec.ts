import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { TaskService } from '../../services/task.service';
import { ItemService } from '../../services/item.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { Item } from '../../models/item.model';
import { ItemRequest } from '../../models/item-request.model';
import { ElementRef, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let itemServiceSpy: jasmine.SpyObj<ItemService>;

  const mockItems: Item[] = [
    { id: 1, title: 'Item 1', itemChecked: false },
    { id: 2, title: 'Item 2', itemChecked: true }
  ];
  const initialTask: Task = { id: 10, title: 'T', completed: false, items: mockItems };

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['updateTask','deleteTask','toggleCheckTask']);
    itemServiceSpy = jasmine.createSpyObj('ItemService', ['createItem','updateItem','toggleCheckItem','deleteItem']);

    await TestBed.configureTestingModule({
      imports: [
        TaskComponent,
        FormsModule,
        ToastComponent,
        ConfirmDialogComponent
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ItemService, useValue: itemServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.taskContainer = new ElementRef(document.createElement('div'));
    component.titleInputTask = new ElementRef(document.createElement('textarea'));
    component.titleInputItems = new QueryList<ElementRef<HTMLTextAreaElement>>();
    component.task = { ...initialTask };
  });

  it('should create and init titles', () => {
    component.ngOnInit();
    expect(component.taskTitle).toBe('T');
    expect(component.editableTitles[1]).toBe('Item 1');
  });

  it('autoGrow adjusts height', () => {
    const ta = document.createElement('textarea');
    ta.value = 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10';
    Object.defineProperty(ta, 'scrollHeight', { value: 100, configurable: true });
    ta.style.height = '10px';
    component.autoGrow({ target: ta } as any);
    expect(ta.style.height).toBe('100px');
  });

  it('focusIn/outContainer toggles isFocused and autoGrow', fakeAsync(() => {
    spyOn(component, 'autoGrow');
    component.focusInContainer();
    expect(component.isFocused).toBeTrue();
    tick(10);
    component.focusOutContainer();
    expect(component.isFocused).toBeFalse();
  }));

  it('onEnter and onBlurTitle reset and grow', fakeAsync(() => {
    spyOn(component, 'saveTitleIfChanged');
    spyOn(component, 'autoGrow');
    component.onEnter({ preventDefault: ()=>{} } as any);
    expect(component.saveTitleIfChanged).toHaveBeenCalled();
    tick(100);
    component.onBlurTitle();
    expect(component.taskTitle).toBe(component.originalTitle);
  }));

  describe('saveTitleIfChanged', () => {
    beforeEach(()=>component.ngOnInit());
    it('updates on change', () => {
      component.taskTitle = 'X';
      taskServiceSpy.updateTask.and.returnValue(of({ ...initialTask, title:'X' }));
      spyOn(component.titleInputTask.nativeElement,'blur');
      component.saveTitleIfChanged();
      expect(component.task.title).toBe('X');
    });
    it('no-op on same/empty', () => {
      component.taskTitle = '   ';
      component.saveTitleIfChanged();
      expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
    });
    it('error path', () => {
      component.taskTitle = 'Y';
      taskServiceSpy.updateTask.and.returnValue(throwError(()=>new Error()));
      component.saveTitleIfChanged();
      expect(component.toastType).toBe('error');
    });
  });

  describe('deleteTask', () => {
    beforeEach(()=>{
      spyOn(component, 'openConfirm').and.callThrough();
      component.taskDeleted = jasmine.createSpyObj('EventEmitter',['emit']);
    });
    it('emit on confirm', () => {
      taskServiceSpy.deleteTask.and.returnValue(of(undefined));
      component.deleteTask();
      component.handleConfirm();
      expect(component.taskDeleted.emit).toHaveBeenCalledWith(10);
    });
    it('error path', () => {
      taskServiceSpy.deleteTask.and.returnValue(throwError(()=>new Error()));
      component.deleteTask();
      component.handleConfirm();
      expect(component.toastType).toBe('error');
    });
  });

  describe('toggleCheckTask', () => {
    it('success', () => {
      const upt = {...initialTask, completed:true};
      taskServiceSpy.toggleCheckTask.and.returnValue(of(upt));
      component.toggleCheckTask();
      expect(component.task.completed).toBeTrue();
    });
    it('error', () => {
      taskServiceSpy.toggleCheckTask.and.returnValue(throwError(()=>new Error()));
      component.toggleCheckTask();
      expect(component.toastType).toBe('error');
    });
  });

  describe('createItem', () => {
    beforeEach(()=>component.ngOnInit());
    it('success', () => {
      component.newItemTitle='Hello';
      const nt = {...initialTask, items:[...mockItems,{id:3,title:'Hello',itemChecked:false}]};
      itemServiceSpy.createItem.and.returnValue(of(nt));
      component.createItem();
      expect(component.task.items.length).toBe(3);
    });
    it('empty no call', ()=> {
      component.newItemTitle='   ';
      component.createItem();
      expect(itemServiceSpy.createItem).not.toHaveBeenCalled();
    });
    it('error', fakeAsync(()=>{
      component.newItemTitle='E';
      itemServiceSpy.createItem.and.returnValue(throwError(()=>new Error()));
      component.createItem();
      tick();
      expect(component.toastType).toBe('error');
    }));
  });

  describe('saveItemTitleIfChanged', () => {
    beforeEach(()=>component.ngOnInit());
    it('success', fakeAsync(()=>{
      const item=mockItems[0];
      component.editableTitles[item.id]='New';
      const ut={...initialTask,items:[{...item,title:'New'}]};
      itemServiceSpy.updateItem.and.returnValue(of(ut));
      component.saveItemTitleIfChanged(item);
      tick();
      expect(component.task.items[0].title).toBe('New');
    }));
    it('no change', ()=>{
      const item=mockItems[0];
      component.editableTitles[item.id]=item.title;
      component.saveItemTitleIfChanged(item);
      expect(itemServiceSpy.updateItem).not.toHaveBeenCalled();
    });
    it('error', fakeAsync(()=>{
      const item=mockItems[0];
      component.editableTitles[item.id]='Err';
      itemServiceSpy.updateItem.and.returnValue(throwError(()=>new Error()));
      component.saveItemTitleIfChanged(item);
      tick();
      expect(component.toastType).toBe('error');
    }));
  });

  describe('toggleItemCheck', () => {
    it('success', ()=>{
      itemServiceSpy.toggleCheckItem.and.returnValue(of({...initialTask,items:[{...mockItems[0],itemChecked:true},mockItems[1]]}));
      component.toggleItemCheck(mockItems[0]);
      expect(component.task.items[0].itemChecked).toBeTrue();
    });
    it('error', ()=>{
      itemServiceSpy.toggleCheckItem.and.returnValue(throwError(()=>new Error()));
      component.toggleItemCheck(mockItems[0]);
      expect(component.toastType).toBe('error');
    });
  });

  describe('deleteItem', () => {
    beforeEach(()=>spyOn(component,'openConfirm').and.callThrough());
    it('success', ()=>{
      const ut={...initialTask,items:[mockItems[1]]};
      itemServiceSpy.deleteItem.and.returnValue(of(ut));
      component.deleteItem(mockItems[0].id);
      component.handleConfirm();
      expect(component.task.items.length).toBe(1);
    });
    it('error', ()=>{
      itemServiceSpy.deleteItem.and.returnValue(throwError(()=>new Error()));
      component.deleteItem(mockItems[0].id);
      component.handleConfirm();
      expect(component.toastType).toBe('error');
    });
  });

  it('getSortedItemsDesc orders desc', () => {
    component.task.items = [{ id:5,title:'A',itemChecked:false },{ id:2,title:'B',itemChecked:false }];
    const sorted = component.getSortedItemsDesc();
    expect(sorted[0].id).toBe(5);
  });

});
