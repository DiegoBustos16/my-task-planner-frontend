import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../auth/services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty initial values', () => {
    expect(component.email).toBe('');
    expect(component.firstName).toBe('');
    expect(component.lastName).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should mark all controls as touched if form is invalid', () => {
    const fakeForm = {
      invalid: true,
      control: { markAllAsTouched: jasmine.createSpy('markAllAsTouched') }
    } as unknown as NgForm;

    component.onRegister(fakeForm);
    expect(fakeForm.control.markAllAsTouched).toHaveBeenCalled();
  });

  it('should not submit if passwords do not match', () => {
    const fakeForm = { valid: true } as NgForm;

    component.password = 'pass1234';
    component.confirmPassword = 'different1234';
    component.onRegister(fakeForm);

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthService.register on valid form and matching passwords', fakeAsync(() => {
    const fakeForm = { valid: true } as NgForm;

    component.email = 'john@mail.com';
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.password = 'Password1';
    component.confirmPassword = 'Password1';

    authServiceSpy.register.and.returnValue(of({}));

    component.onRegister(fakeForm);
    tick();

    expect(authServiceSpy.register).toHaveBeenCalledOnceWith({
      email: 'john@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password1'
    });
  }));

  it('should set errorMessage on registration error with message', fakeAsync(() => {
    const fakeForm = { valid: true } as NgForm;
    component.password = 'pass1234';
    component.confirmPassword = 'pass1234';

    authServiceSpy.register.and.returnValue(throwError(() => ({
      error: { message: 'Email already exists' }
    })));

    component.onRegister(fakeForm);
    tick();

    expect(component.errorMessage).toBe('Registration failed: Email already exists');
  }));

  it('should set generic errorMessage if error response is unknown', fakeAsync(() => {
    const fakeForm = { valid: true } as NgForm;
    component.password = 'pass1234';
    component.confirmPassword = 'pass1234';

    authServiceSpy.register.and.returnValue(throwError(() => ({})));

    component.onRegister(fakeForm);
    tick();

    expect(component.errorMessage).toBe('Registration failed: Unknown error');
  }));
});
