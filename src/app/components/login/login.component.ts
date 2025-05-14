import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm): void {
  if (loginForm.invalid) {
    loginForm.control.markAllAsTouched();
    return;
  }

  this.authService.login({ email: this.email, password: this.password }).subscribe({
    next: () => this.router.navigate(['/main']),
    error: err => this.errorMessage = 'Wrong email or password'
  });
}
}
