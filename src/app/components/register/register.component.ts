import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  email = '';
  firstName = '';
  lastName = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      registerForm.control.markAllAsTouched();
      return;
    }

    if (registerForm.valid && this.password === this.confirmPassword) {
      const request: RegisterRequest = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      };

      this.authService.register(request).subscribe({
        next: () => {
          console.log('User registered');
        },
        error: (err) => {
          this.errorMessage = 'Registration failed: ' + (err.error?.message ?? 'Unknown error');
        }
      });
    }
  }
}
