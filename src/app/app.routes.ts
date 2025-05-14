import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/layouts/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(m => m.LoginComponent)
      }
    ]
  }
];
