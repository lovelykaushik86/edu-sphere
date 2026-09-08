import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.service';
import { AuthPageComponent } from './features/auth/pages/auth-page.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard.component';
export const routes: Routes = [
  { path: 'login', component: AuthPageComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthPageComponent, data: { mode: 'register' } },
  { path: 'forgot-password', component: AuthPageComponent, data: { mode: 'forgot' } },
  { path: 'reset-password', component: AuthPageComponent, data: { mode: 'reset' } },
  { path: 'verify-email', component: AuthPageComponent, data: { mode: 'verify' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' }, { path: '**', redirectTo: 'login' }
];
