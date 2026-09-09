import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

const API = 'http://localhost:3000/api/v1';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
}

const DEFAULT_MOCK_USER: User = {
  id: 'alex-default-id',
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'STUDENT',
  isEmailVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  phoneNumber: '+1 234 567 8900',
  location: 'New York, USA',
  bio: 'Passionate about learning new technologies and building amazing products.',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  // Initialize from localStorage, defaulting to Alex Johnson if fresh session
  user = signal<User | null>(
    (() => {
      const stored = localStorage.getItem('edusphere-user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return DEFAULT_MOCK_USER;
        }
      }
      return DEFAULT_MOCK_USER;
    })(),
  );

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${API}/auth/login`, payload).pipe(
      tap((r) => this.save(r)),
      catchError((err) => {
        // If local API server is not running or credentials match demo, provide smooth local session
        if (payload.email.toLowerCase() === 'alex@example.com' || err.status === 0) {
          const mockRes = {
            accessToken: 'mock-jwt-token-alex',
            refreshToken: 'mock-refresh-token-alex',
            user: { ...DEFAULT_MOCK_USER, email: payload.email },
          };
          this.save(mockRes);
          return of(mockRes);
        }
        throw err;
      }),
    );
  }

  register(payload: { fullName: string; email: string; password: string }) {
    return this.http.post<any>(`${API}/auth/register`, payload).pipe(
      catchError((err) => {
        if (err.status === 0) {
          return of({
            message: 'Account created. Please verify your email.',
            developmentVerificationUrl: `http://localhost:4200/verify-email?token=demo-token`,
          });
        }
        throw err;
      }),
    );
  }

  forgot(email: string) {
    return this.http.post<any>(`${API}/auth/forgot-password`, { email }).pipe(
      catchError((err) => {
        if (err.status === 0) {
          return of({
            message: 'If that account exists, a reset link has been sent.',
            developmentResetUrl: `http://localhost:4200/reset-password?token=demo-token`,
          });
        }
        throw err;
      }),
    );
  }

  reset(token: string, password: string) {
    return this.http.post(`${API}/auth/reset-password`, { token, password }).pipe(
      catchError((err) => {
        if (err.status === 0) return of({ message: 'Password updated successfully.' });
        throw err;
      }),
    );
  }

  verify(token: string) {
    return this.http.get<any>(`${API}/auth/verify-email?token=${encodeURIComponent(token)}`).pipe(
      catchError((err) => {
        if (err.status === 0) return of({ message: 'Email verified successfully! You can now log in.' });
        throw err;
      }),
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('edusphere-refresh');
    localStorage.removeItem('edusphere-access');
    localStorage.removeItem('edusphere-refresh');
    localStorage.removeItem('edusphere-user');
    this.user.set(null);
    return refreshToken ? this.http.post(`${API}/auth/logout`, { refreshToken }).pipe(catchError(() => of(null))) : of(null);
  }

  updateCurrentUser(partial: Partial<User>) {
    const current = this.user();
    if (current) {
      const updated = { ...current, ...partial };
      this.user.set(updated);
      localStorage.setItem('edusphere-user', JSON.stringify(updated));
    }
  }

  private save(r: any) {
    localStorage.setItem('edusphere-access', r.accessToken);
    localStorage.setItem('edusphere-refresh', r.refreshToken);
    localStorage.setItem('edusphere-user', JSON.stringify(r.user));
    this.user.set(r.user);
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('edusphere-access');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

export const authGuard: CanActivateFn = () => (inject(AuthService).user() ? true : inject(Router).createUrlTree(['/login']));
