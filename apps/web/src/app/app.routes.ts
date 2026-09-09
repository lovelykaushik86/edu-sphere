import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.service';
import { AuthPageComponent } from './features/auth/pages/auth-page.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard.component';
import { CourseListComponent } from './features/courses/pages/course-list.component';
import { CourseDetailComponent } from './features/courses/pages/course-detail.component';
import { ProfileComponent } from './features/profile/pages/profile.component';
import { CertificatesComponent } from './features/certificates/pages/certificates.component';
import { MessagesComponent } from './features/messages/pages/messages.component';
import { CalendarComponent } from './features/calendar/pages/calendar.component';
import { OrganizationComponent } from './features/organization/pages/organization.component';

export const routes: Routes = [
  // Auth Routes
  { path: 'login', component: AuthPageComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthPageComponent, data: { mode: 'register' } },
  { path: 'forgot-password', component: AuthPageComponent, data: { mode: 'forgot' } },
  { path: 'reset-password', component: AuthPageComponent, data: { mode: 'reset' } },
  { path: 'verify-email', component: AuthPageComponent, data: { mode: 'verify' } },

  // Portal & Learning Routes (Sprint 2 & Sprint 3)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'courses', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'courses/enrolled', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'courses/:slug', component: CourseDetailComponent, canActivate: [authGuard] },
  { path: 'assignments', component: CalendarComponent, data: { view: 'assignments' }, canActivate: [authGuard] },
  { path: 'certificates', component: CertificatesComponent, canActivate: [authGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [authGuard] },
  { path: 'wishlist', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'organizations', component: OrganizationComponent, canActivate: [authGuard] },
  { path: 'help', component: ProfileComponent, canActivate: [authGuard] },

  // Defaults
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
