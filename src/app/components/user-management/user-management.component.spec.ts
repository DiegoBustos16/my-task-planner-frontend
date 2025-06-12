import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { of, throwError, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserUpdate } from '../../models/user-update.model';
import { PasswordUpdate } from '../../models/password-update.model';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getUser',
      'updateUser',
      'updatePassword',
      'deleteUser'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch current user on init', () => {
    const mockUser: User = {
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe'
    };
    userServiceSpy.getUser.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.email).toBe('test@example.com');
    expect(component.firstName).toBe('Jane');
    expect(component.lastName).toBe('Doe');
  });

  it('should show error toast if fetch current user fails', () => {
    spyOn(component, 'showToast');
    userServiceSpy.getUser.and.returnValue(throwError(() => new Error('User fetch failed')));

    component.loadCurrentUser();

    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Failed to load user data.', 'error');
  });

  it('should not call updateUser if form is invalid', () => {
    const fakeForm = { invalid: true } as NgForm;

    component.onSubmitUser(fakeForm);

    expect(userServiceSpy.updateUser).not.toHaveBeenCalled();
  });

  it('should update user and show success toast', () => {
    spyOn(component, 'showToast');
    const fakeForm = { invalid: false } as NgForm;
    userServiceSpy.updateUser.and.returnValue(of({} as User));

    component.firstName = 'New';
    component.lastName = 'Name';
    component.onSubmitUser(fakeForm);

    const expectedPayload: UserUpdate = {
      firstName: 'New',
      lastName: 'Name'
    };
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(expectedPayload);
    expect(component.showToast).toHaveBeenCalledWith('User updated successfully.');
  });

  it('should show error toast if updateUser fails', () => {
    spyOn(component, 'showToast');
    const fakeForm = { invalid: false } as NgForm;
    userServiceSpy.updateUser.and.returnValue(throwError(() => new Error('Update failed')));

    component.onSubmitUser(fakeForm);

    expect(userServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Failed to update user.', 'error');
  });

  it('should call authService.logout and show success toast', () => {
    spyOn(component, 'showToast');
    authServiceSpy.logout.and.callThrough();

    component.onLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Logged out successfully.');
  });

  it('should show error toast if logout throws', () => {
    spyOn(component, 'showToast');
    authServiceSpy.logout.and.throwError('Logout error');

    component.onLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Failed to log out.', 'error');
  });

  it('onChangePasswordClick should set isChangingPassword true and clear fields', () => {
    component.currentPassword = 'old';
    component.newPassword = 'new';
    component.confirmPassword = 'new';
    component.isChangingPassword = false;

    component.onChangePasswordClick();

    expect(component.isChangingPassword).toBeTrue();
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('onCancelChangePassword should set isChangingPassword false and clear fields', () => {
    component.currentPassword = 'old';
    component.newPassword = 'new';
    component.confirmPassword = 'new';
    component.isChangingPassword = true;

    component.onCancelChangePassword();

    expect(component.isChangingPassword).toBeFalse();
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('clearPasswordFields should clear all password fields', () => {
    component.currentPassword = 'a';
    component.newPassword = 'b';
    component.confirmPassword = 'c';

    component.clearPasswordFields();

    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('openConfirm should set showConfirm, confirmMessage, and confirmAction correctly', () => {
    const action = jasmine.createSpy('confirmAction');

    component.openConfirm('Are you sure?', action);

    expect(component.showConfirm).toBeTrue();
    expect(component.confirmMessage).toBe('Are you sure?');
    expect(component.confirmAction).toBe(action);
  });

  it('handleConfirm should execute confirmAction and hide dialog', () => {
    const action = jasmine.createSpy('confirmAction');
    component.showConfirm = true;
    component.confirmAction = action;

    component.handleConfirm();

    expect(component.showConfirm).toBeFalse();
    expect(action).toHaveBeenCalled();
  });

  it('handleCancel should hide the confirmation dialog', () => {
    component.showConfirm = true;

    component.handleCancel();

    expect(component.showConfirm).toBeFalse();
  });

  it('should not call updatePassword if form is invalid', () => {
    const fakeForm = { invalid: true } as NgForm;

    component.onSubmitPassword(fakeForm);

    expect(userServiceSpy.updatePassword).not.toHaveBeenCalled();
  });

  it('should show error toast if passwords do not match', () => {
    spyOn(component, 'showToast');
    const fakeForm = { invalid: false } as NgForm;
    component.newPassword = 'abc';
    component.confirmPassword = 'def';

    component.onSubmitPassword(fakeForm);

    expect(component.showToast).toHaveBeenCalledWith('Passwords do not match.', 'error');
    expect(userServiceSpy.updatePassword).not.toHaveBeenCalled();
  });

  it('should update password, show success, reset state on success', fakeAsync(() => {
    spyOn(component, 'showToast');
    const fakeForm = { invalid: false } as NgForm;
    component.currentPassword = 'oldPass';
    component.newPassword = 'newPass123';
    component.confirmPassword = 'newPass123';
    component.isChangingPassword = true;

    userServiceSpy.updatePassword.and.returnValue(of({} as any));

    component.onSubmitPassword(fakeForm);

    const expectedPayload: PasswordUpdate = {
      oldPassword: 'oldPass',
      newPassword: 'newPass123'
    };
    expect(userServiceSpy.updatePassword).toHaveBeenCalledWith(expectedPayload);
    expect(component.showToast).toHaveBeenCalledWith('Password updated successfully.');
    expect(component.isChangingPassword).toBeFalse();
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmPassword).toBe('');
  }));

  it('should show error toast if updatePassword fails', () => {
    spyOn(component, 'showToast');
    const fakeForm = { invalid: false } as NgForm;
    component.currentPassword = 'old';
    component.newPassword = 'newPass123';
    component.confirmPassword = 'newPass123';

    userServiceSpy.updatePassword.and.returnValue(throwError(() => new Error('Update error')));

    component.onSubmitPassword(fakeForm);

    expect(userServiceSpy.updatePassword).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Failed to update password.', 'error');
  });

  it('should open confirmation and then delete user on confirm success path', fakeAsync(() => {
    spyOn(component, 'showToast');
    spyOn(component, 'onLogout');
    userServiceSpy.deleteUser.and.returnValue(
      new Observable<void>((observer) => {
        observer.next();
        observer.complete();
      })
    );

    component.onDeleteUser();
    expect(component.showConfirm).toBeTrue();
    component.handleConfirm();
    tick();

    expect(userServiceSpy.deleteUser).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Account deleted successfully');
    expect(component.onLogout).toHaveBeenCalled();
  }));

  it('should show error toast if deleteUser fails and not call onLogout', fakeAsync(() => {
    spyOn(component, 'showToast');
    spyOn(component, 'onLogout');
    userServiceSpy.deleteUser.and.returnValue(throwError(() => new Error('Delete failed')));

    component.onDeleteUser();
    expect(component.showConfirm).toBeTrue();
    component.handleConfirm();
    tick();

    expect(userServiceSpy.deleteUser).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Error deleting account', 'error');
    expect(component.onLogout).not.toHaveBeenCalled();
  }));

  it('should set toastMessage and toastType and clear after timeout', fakeAsync(() => {
    component.showToast('Test message', 'success');
    expect(component.toastMessage).toBe('Test message');
    expect(component.toastType).toBe('success');

    tick(3000);
    expect(component.toastMessage).toBe('');
  }));
});
