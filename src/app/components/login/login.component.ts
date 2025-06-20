import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm): void {

  const request: LoginRequest = {
    email: this.email,
    password: this.password
  };

  if (loginForm.invalid) {
    loginForm.control.markAllAsTouched();
    return;
  }

  this.authService.login({ email: this.email, password: this.password }).subscribe({
    next: () => this.router.navigate(['/main']),
    error: err => this.errorMessage = 'Wrong email or password'
  });
}
  
  signInDemoUser(): void {
    this.email = 'demo@mail.com';
    this.password = 'demo1234';

    const fakeForm = {
      invalid: false,
      control: { markAllAsTouched: () => {} }
    } as NgForm;

    this.onSubmit(fakeForm);
  }
}
