import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message when no input provided', () => {
    const messageElement: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(messageElement.textContent?.trim()).toBe('Are you sure?');
  });

  it('should display the provided message via @Input()', () => {
    component.message = 'Custom confirmation text';
    fixture.detectChanges();
    const messageElement: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(messageElement.textContent?.trim()).toBe('Custom confirmation text');
  });

  it('should emit cancel event when Cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    const cancelButton = fixture.debugElement.queryAll(By.css('button'))[0];
    cancelButton.triggerEventHandler('click', null);
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should emit confirm event when Confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');
    const confirmButton = fixture.debugElement.queryAll(By.css('button'))[1];
    confirmButton.triggerEventHandler('click', null);
    expect(component.confirm.emit).toHaveBeenCalled();
  });
});
