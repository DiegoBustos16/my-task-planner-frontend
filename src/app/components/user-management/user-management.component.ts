import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserUpdate } from '../../models/user-update.model';
import { PasswordUpdate } from '../../models/password-update.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent, ToastComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  isChangingPassword: boolean = false;

  showConfirm = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private userService: UserService
              , private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getUser().subscribe({
      next: (user: User) => {
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
      },
      error: (err) => {
        this.showToast('Failed to load user data.', 'error');
      }
    });
  }

  onSubmitUser(form: NgForm): void {
    if (form.invalid) return;

    const updateUser: UserUpdate = {
      firstName: this.firstName,
      lastName: this.lastName,
    };

    this.userService.updateUser(updateUser).subscribe({
      next: () => {
        this.showToast('User updated successfully.');
      },
      error: () => {
        this.showToast('Failed to update user.', 'error');
      }
    });
  }

  onLogout(): void {
    try {
      this.authService.logout();
      this.showToast('Logged out successfully.');
    } catch (error) {
      this.showToast('Failed to log out.', 'error');
    }
  }

  onChangePasswordClick(): void {
    this.isChangingPassword = true;
    this.clearPasswordFields();
  }

  onCancelChangePassword(): void {
    this.isChangingPassword = false;
    this.clearPasswordFields();
  }

  clearPasswordFields(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
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

  onSubmitPassword(form: NgForm): void {
    if (form.invalid) return;

    if (this.newPassword !== this.confirmPassword) {
      this.showToast('Passwords do not match.', 'error');
      return;
    }

    const passwordUpdate: PasswordUpdate = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.updatePassword(passwordUpdate).subscribe({
      next: () => {
        this.showToast('Password updated successfully.');
        this.isChangingPassword = false;
        this.clearPasswordFields();
      },
      error: () => {
        this.showToast('Failed to update password.', 'error');
      }
    });
  }

  onDeleteUser(): void {
    this.openConfirm('Are you sure you want to delete your account?', () => {
      this.userService.deleteUser().subscribe({
        next: () => this.showToast('Account deleted successfully'),
        complete: () => {
          this.onLogout();
        },
        error: () => this.showToast('Error deleting account', 'error')
      });
    });
  }

  
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
