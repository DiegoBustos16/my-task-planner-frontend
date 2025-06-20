import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/layouts/auth-layout.component';
import { MainLayoutComponent } from './components/layouts/main-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/login/login.component').then(m => m.LoginComponent),
      },
    ],
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'main'
  }
];
