import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { By } from '@angular/platform-browser';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided message via @Input()', () => {
    component.message = 'Test toast message';
    component.type = 'success';
    fixture.detectChanges();
    const toastElement: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(toastElement.textContent?.trim()).toBe('Test toast message');
  });

  it('should apply success classes when type is "success"', () => {
    component.message = 'Success toast';
    component.type = 'success';
    fixture.detectChanges();
    const toastElement: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(toastElement.classList).toContain('text-green-600');
    expect(toastElement.classList).toContain('border-green-600');
  });

  it('should apply error classes when type is "error"', () => {
    component.message = 'Error toast';
    component.type = 'error';
    fixture.detectChanges();
    const toastElement: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(toastElement.classList).toContain('text-red-500');
    expect(toastElement.classList).toContain('border-red-500');
  });
});
