import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent,FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router,      useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty initial email and password', () => {
      expect(component.email).toBe('', 'email debe iniciarse vacío');
      expect(component.password).toBe('', 'password debe iniciarse vacío');
    });

    it('signInDemoUser should fill credentials and call onSubmit', () => {
      const submitSpy = spyOn(component, 'onSubmit');
      component.signInDemoUser();

      expect(component.email).toBe('demo@mail.com');
      expect(component.password).toBe('demo1234');

      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it('onSubmit should mark all as touched if form is invalid', () => {
      const fakeForm = {
        invalid: true,
        control: { markAllAsTouched: jasmine.createSpy('markAllAsTouched') }
      } as unknown as NgForm;

      component.onSubmit(fakeForm);
      expect(fakeForm.control.markAllAsTouched).toHaveBeenCalled();
    });

    it('onSubmit should call AuthService.login and navigate on success', fakeAsync(() => {
      const fakeForm = { invalid: false } as NgForm;
      authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));

      component.email = 'u@mail.com';
      component.password = 'pass';
      component.onSubmit(fakeForm);

      tick();
      expect(authServiceSpy.login).toHaveBeenCalledOnceWith({
        email: 'u@mail.com', password: 'pass'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/main']);
    }));

    it('onSubmit should set errorMessage on login error', fakeAsync(() => {
      const fakeForm = { invalid: false } as NgForm;
      authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

      component.onSubmit(fakeForm);
      tick();
      expect(component.errorMessage).toBe('Wrong email or password');
    }));


  });