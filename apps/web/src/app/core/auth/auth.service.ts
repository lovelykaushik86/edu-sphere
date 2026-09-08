import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
const API = 'http://localhost:3000/api/v1';
export interface User { id: string; fullName: string; email: string; role: string; isEmailVerified: boolean; }
@Injectable({ providedIn: 'root' }) export class AuthService {
  private http = inject(HttpClient); user = signal<User | null>(JSON.parse(localStorage.getItem('edusphere-user') || 'null'));
  login(payload: { email:string; password:string }) { return this.http.post<any>(`${API}/auth/login`, payload).pipe(tap(r => this.save(r))); }
  register(payload: { fullName:string; email:string; password:string }) { return this.http.post<any>(`${API}/auth/register`, payload); }
  forgot(email:string) { return this.http.post<any>(`${API}/auth/forgot-password`, { email }); }
  reset(token:string, password:string) { return this.http.post(`${API}/auth/reset-password`, { token, password }); }
  verify(token:string) { return this.http.get<any>(`${API}/auth/verify-email?token=${encodeURIComponent(token)}`); }
  logout() { const refreshToken = localStorage.getItem('edusphere-refresh'); localStorage.removeItem('edusphere-access'); localStorage.removeItem('edusphere-refresh'); localStorage.removeItem('edusphere-user'); this.user.set(null); return refreshToken ? this.http.post(`${API}/auth/logout`, { refreshToken }) : of(null); }
  private save(r:any) { localStorage.setItem('edusphere-access', r.accessToken); localStorage.setItem('edusphere-refresh', r.refreshToken); localStorage.setItem('edusphere-user', JSON.stringify(r.user)); this.user.set(r.user); }
}
export const authInterceptor: HttpInterceptorFn = (req, next) => { const token = localStorage.getItem('edusphere-access'); return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req); };
export const authGuard: CanActivateFn = () => inject(AuthService).user() ? true : inject(Router).createUrlTree(['/login']);
