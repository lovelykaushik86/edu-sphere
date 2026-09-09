import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { BrandComponent } from '../../../shared/ui/brand/brand.component';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, BrandComponent],
  template: `
    <main class="auth-viewport" [class]="mode()">
      <div class="auth-card-wrapper">
        <!-- Left Column: Form Pane -->
        <div class="auth-form-side">
          <div class="auth-brand-row">
            <edu-brand />
          </div>

          @switch (mode()) {
            @case ('login') {
              <div class="form-header">
                <h1>Welcome Back</h1>
                <p>Sign in to your account to continue</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="login()" class="main-form">
                <div class="input-field-wrap">
                  <label>Email address</label>
                  <div class="input-box">
                    <span class="field-icon">✉</span>
                    <input type="email" placeholder="you@example.com" formControlName="email" />
                  </div>
                </div>

                <div class="input-field-wrap">
                  <label>Password</label>
                  <div class="input-box">
                    <span class="field-icon">🔒</span>
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      placeholder="••••••••"
                      formControlName="password"
                    />
                    <button type="button" class="eye-btn" (click)="toggleShowPassword()">
                      {{ showPassword() ? '👁' : '👁‍🗨' }}
                    </button>
                  </div>
                </div>

                <div class="form-util-row">
                  <label class="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" class="submit-action-btn" [disabled]="loginForm.invalid || busy()">
                  {{ busy() ? 'Signing In…' : 'Sign In' }}
                </button>

                <div class="divider-row">
                  <span>or continue with</span>
                </div>

                <div class="social-buttons">
                  <button type="button" class="social-btn google" (click)="socialLogin('Google')">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button type="button" class="social-btn ms" (click)="socialLogin('Microsoft')">
                    <svg width="18" height="18" viewBox="0 0 23 23">
                      <rect fill="#F25022" x="1" y="1" width="10" height="10"/>
                      <rect fill="#7FBA00" x="12" y="1" width="10" height="10"/>
                      <rect fill="#00A4EF" x="1" y="12" width="10" height="10"/>
                      <rect fill="#FFB900" x="12" y="12" width="10" height="10"/>
                    </svg>
                    Continue with Microsoft
                  </button>
                </div>

                <p class="bottom-footnote">
                  Don’t have an account? <a routerLink="/register">Create one</a>
                </p>
              </form>
            }

            @case ('register') {
              <div class="form-header">
                <h1>Create Your Account</h1>
                <p>Join thousands of learners and start your journey</p>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="register()" class="main-form">
                <div class="input-field-wrap">
                  <label>Full Name</label>
                  <div class="input-box">
                    <span class="field-icon">👤</span>
                    <input placeholder="Alex Johnson" formControlName="fullName" />
                  </div>
                </div>

                <div class="input-field-wrap">
                  <label>Email address</label>
                  <div class="input-box">
                    <span class="field-icon">✉</span>
                    <input type="email" placeholder="you@example.com" formControlName="email" />
                  </div>
                </div>

                <div class="input-field-wrap">
                  <label>Password</label>
                  <div class="input-box">
                    <span class="field-icon">🔒</span>
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      placeholder="At least 8 characters"
                      formControlName="password"
                    />
                    <button type="button" class="eye-btn" (click)="toggleShowPassword()">
                      {{ showPassword() ? '👁' : '👁‍🗨' }}
                    </button>
                  </div>
                </div>

                <div class="input-field-wrap">
                  <label>Confirm Password</label>
                  <div class="input-box">
                    <span class="field-icon">🔒</span>
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      placeholder="Repeat password"
                      formControlName="confirm"
                    />
                  </div>
                </div>

                <label class="checkbox-label terms">
                  <input type="checkbox" formControlName="terms" />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>

                <button type="submit" class="submit-action-btn" [disabled]="registerForm.invalid || busy()">
                  {{ busy() ? 'Creating account…' : 'Create Account' }}
                </button>

                <div class="divider-row">
                  <span>or sign up with</span>
                </div>

                <div class="social-buttons mini">
                  <button type="button" class="social-btn google-mini" (click)="socialLogin('Google')">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </button>
                  <button type="button" class="social-btn ms-mini" (click)="socialLogin('Microsoft')">
                    <svg width="18" height="18" viewBox="0 0 23 23">
                      <rect fill="#F25022" x="1" y="1" width="10" height="10"/>
                      <rect fill="#7FBA00" x="12" y="1" width="10" height="10"/>
                      <rect fill="#00A4EF" x="1" y="12" width="10" height="10"/>
                      <rect fill="#FFB900" x="12" y="12" width="10" height="10"/>
                    </svg>
                  </button>
                </div>

                <p class="bottom-footnote">
                  Already have an account? <a routerLink="/login">Sign in</a>
                </p>
              </form>
            }

            @case ('forgot') {
              <div class="form-header">
                <h1>Reset Your Password</h1>
                <p>Enter your email and we’ll send you a link to reset your password.</p>
              </div>

              <form [formGroup]="forgotForm" (ngSubmit)="forgot()" class="main-form">
                <div class="input-field-wrap">
                  <label>Email address</label>
                  <div class="input-box">
                    <span class="field-icon">✉</span>
                    <input type="email" placeholder="you@example.com" formControlName="email" />
                  </div>
                </div>

                <button type="submit" class="submit-action-btn" [disabled]="forgotForm.invalid || busy()">
                  {{ busy() ? 'Sending…' : 'Send Reset Link' }}
                </button>

                <p class="bottom-footnote">
                  <a routerLink="/login">← Back to login</a>
                </p>
              </form>
            }

            @case ('reset') {
              <div class="form-header">
                <h1>Choose a New Password</h1>
                <p>Set a secure password for your EduSphere account.</p>
              </div>

              <form [formGroup]="resetForm" (ngSubmit)="reset()" class="main-form">
                <div class="input-field-wrap">
                  <label>New password</label>
                  <div class="input-box">
                    <span class="field-icon">🔒</span>
                    <input type="password" formControlName="password" />
                  </div>
                </div>

                <div class="input-field-wrap">
                  <label>Confirm password</label>
                  <div class="input-box">
                    <span class="field-icon">🔒</span>
                    <input type="password" formControlName="confirm" />
                  </div>
                </div>

                <button type="submit" class="submit-action-btn" [disabled]="resetForm.invalid || busy()">
                  Update Password
                </button>
              </form>
            }

            @case ('verify') {
              <div class="verify-status-card">
                <div class="verify-icon-wrap">✉</div>
                <h1>{{ message() || 'Verifying your email…' }}</h1>
                <p>We’re setting up your account securely.</p>
                <a routerLink="/login" class="submit-action-btn text-center">Back to login</a>
              </div>
            }
          }

          @if (message() && mode() !== 'verify') {
            <div class="feedback-box notice">
              <span>{{ message() }}</span>
              @if (actionUrl()) {
                <a [href]="actionUrl()">Open development link</a>
              }
            </div>
          }

          @if (error()) {
            <div class="feedback-box error">
              <span>{{ error() }}</span>
            </div>
          }
        </div>

        <!-- Right Column: Hero Visual Pane -->
        <aside class="auth-hero-side" [class]="mode()">
          @if (mode() === 'login') {
            <!-- Login Hero (Navy) -->
            <div class="hero-card navy">
              <div class="hero-photo-wrap">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Student with headphones"
                  class="student-photo"
                />
              </div>
              <h2>Your Learning Journey Starts Here</h2>
              <p>Access world-class courses, learn from experts and build a better future.</p>
              <div class="carousel-dots">
                <span class="dot active"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div class="hero-metrics-row">
                <div class="metric-item">
                  <b>10K+</b>
                  <small>Students</small>
                </div>
                <div class="metric-item">
                  <b>500+</b>
                  <small>Courses</small>
                </div>
                <div class="metric-item">
                  <b>100+</b>
                  <small>Expert Trainers</small>
                </div>
              </div>
            </div>
          } @else if (mode() === 'register') {
            <!-- Register Hero (Light Blue) -->
            <div class="hero-card light-blue">
              <div class="hero-illustration">
                <div class="illustration-art">📚 💻 🎓</div>
              </div>
              <h2>Learn Without Limits</h2>
              <span class="hero-subhead">Flexible. Affordable. Impactful.</span>
              <blockquote class="quote-text">
                “Education is the most powerful weapon which you can use to change the world.”
                <cite>— Nelson Mandela</cite>
              </blockquote>
            </div>
          } @else {
            <!-- Forgot Password Hero -->
            <div class="hero-card forgot-hero">
              <div class="mail-art">✉️ ✈️</div>
              <h2>Check Your Email</h2>
              <p>We’ve sent a password reset link to your email address. Please check your inbox.</p>
            </div>
          }
        </aside>
      </div>
    </main>
  `,
  styles: [`
    .auth-viewport {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      background: linear-gradient(135deg, #f0f6ff, #f8fafc);
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .auth-card-wrapper {
      width: 1000px;
      max-width: 100%;
      min-height: 640px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    /* Left Form Side */
    .auth-form-side {
      padding: 48px 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #ffffff;
    }
    .auth-brand-row {
      margin-bottom: 28px;
    }
    .form-header h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .form-header p {
      font-size: 12px;
      color: #64748b;
      margin: 6px 0 22px;
    }

    .main-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .input-field-wrap label {
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      display: block;
      margin-bottom: 5px;
    }
    .input-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .field-icon {
      position: absolute;
      left: 12px;
      font-size: 13px;
      color: #94a3b8;
      pointer-events: none;
    }
    .input-box input {
      width: 100%;
      height: 40px;
      border: 1px solid #dce5f1;
      border-radius: 6px;
      padding: 0 38px 0 34px;
      font-size: 12.5px;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
      box-sizing: border-box;
      background: #ffffff;
    }
    .input-box input:focus {
      border-color: #1868db;
      box-shadow: 0 0 0 3px rgba(24, 104, 219, 0.1);
    }
    .eye-btn {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
      padding: 4px;
    }

    .form-util-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      margin-top: 2px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #475569;
      cursor: pointer;
    }
    .checkbox-label.terms {
      font-size: 11px;
    }
    .forgot-link {
      color: #1868db;
      font-weight: 600;
      text-decoration: none;
    }

    .submit-action-btn {
      height: 42px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
      transition: background 0.15s;
    }
    .submit-action-btn:hover:not(:disabled) {
      background: #1459be;
    }
    .submit-action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .divider-row {
      display: flex;
      align-items: center;
      margin: 8px 0;
      text-align: center;
    }
    .divider-row::before, .divider-row::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e2e8f0;
    }
    .divider-row span {
      padding: 0 10px;
      font-size: 10.5px;
      color: #94a3b8;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .social-buttons.mini {
      flex-direction: row;
      justify-content: center;
    }
    .social-btn {
      height: 38px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #ffffff;
      color: #1e293b;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .social-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .google-mini, .ms-mini {
      width: 48px;
      padding: 0;
    }

    .bottom-footnote {
      text-align: center;
      font-size: 11.5px;
      color: #64748b;
      margin-top: 14px;
    }
    .bottom-footnote a {
      color: #1868db;
      font-weight: 600;
      text-decoration: none;
    }

    .feedback-box {
      margin-top: 14px;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 11.5px;
      line-height: 1.4;
    }
    .feedback-box.notice { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    .feedback-box.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

    /* Right Hero Side */
    .auth-hero-side {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Login Hero */
    .hero-card.navy {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0b1f44 0%, #061129 100%);
      color: white;
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }
    .hero-photo-wrap {
      margin-bottom: 24px;
    }
    .student-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .hero-card.navy h2 {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.25;
      margin: 0 0 10px;
      max-width: 320px;
    }
    .hero-card.navy p {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 20px;
      max-width: 340px;
    }
    .carousel-dots {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
    .dot.active {
      background: #38bdf8;
      width: 20px;
      border-radius: 4px;
    }
    .hero-metrics-row {
      display: flex;
      justify-content: space-around;
      width: 100%;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }
    .metric-item b {
      display: block;
      font-size: 16px;
      color: white;
    }
    .metric-item small {
      font-size: 10px;
      color: #94a3b8;
    }

    /* Register Hero */
    .hero-card.light-blue {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f0f7ff, #e0edff);
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      color: #0f172a;
    }
    .hero-illustration {
      margin-bottom: 24px;
    }
    .illustration-art {
      font-size: 48px;
      background: white;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      box-shadow: 0 10px 25px rgba(24, 104, 219, 0.12);
    }
    .hero-card.light-blue h2 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .hero-subhead {
      font-size: 12.5px;
      color: #1868db;
      font-weight: 600;
      margin: 4px 0 24px;
      display: block;
    }
    .quote-text {
      font-size: 12.5px;
      color: #475569;
      font-style: italic;
      line-height: 1.5;
      max-width: 320px;
      margin: 0;
    }
    .quote-text cite {
      display: block;
      margin-top: 8px;
      font-weight: 700;
      font-style: normal;
      color: #1e293b;
      font-size: 11px;
    }

    /* Forgot Hero */
    .hero-card.forgot-hero {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #eff6ff, #f8fafc);
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }
    .mail-art {
      font-size: 52px;
      margin-bottom: 16px;
    }
    .hero-card.forgot-hero h2 {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .hero-card.forgot-hero p {
      font-size: 12px;
      color: #64748b;
      max-width: 300px;
      margin: 0;
    }

    .verify-status-card {
      text-align: center;
      padding: 20px 0;
    }
    .verify-icon-wrap {
      font-size: 42px;
      margin-bottom: 16px;
    }
    .text-center {
      display: block;
      text-align: center;
      line-height: 42px;
      text-decoration: none;
    }

    @media (max-width: 860px) {
      .auth-card-wrapper { grid-template-columns: 1fr; }
      .auth-hero-side { display: none; }
      .auth-form-side { padding: 32px 24px; }
    }
  `],
})
export class AuthPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  mode = signal(this.route.snapshot.data['mode'] || 'login');
  busy = signal(false);
  message = signal('');
  error = signal('');
  actionUrl = signal('');
  showPassword = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['alex@example.com', [Validators.required, Validators.email]],
    password: ['Password123!', [Validators.required, Validators.minLength(8)]],
  });

  registerForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
  });

  forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  });

  constructor() {
    if (this.mode() === 'verify') {
      const token = this.route.snapshot.queryParamMap.get('token');
      if (token) {
        this.auth.verify(token).subscribe({
          next: (r) => this.message.set(r.message),
          error: (e) => this.message.set(e.error?.message || 'This verification link is invalid or expired.'),
        });
      }
    }
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  socialLogin(provider: string) {
    this.toast.show(`Redirecting to ${provider} authentication…`, 'info');
    setTimeout(() => {
      this.login();
    }, 800);
  }

  private run(fn: () => any, done?: () => void) {
    this.error.set('');
    this.message.set('');
    this.actionUrl.set('');
    this.busy.set(true);
    fn().subscribe({
      next: (r: any) => {
        this.busy.set(false);
        if (done) done();
        else {
          this.message.set(r.message || 'Success.');
          this.actionUrl.set(r.developmentVerificationUrl || r.developmentResetUrl || '');
        }
      },
      error: (e: any) => {
        this.busy.set(false);
        this.error.set(e.error?.message || 'Something went wrong. Please try again.');
        this.toast.show(this.error(), 'error');
      },
    });
  }

  login() {
    this.run(
      () => this.auth.login(this.loginForm.getRawValue()),
      () => {
        this.toast.show('Welcome back, Alex!', 'success');
        this.router.navigateByUrl('/dashboard');
      },
    );
  }

  register() {
    const v = this.registerForm.getRawValue();
    if (v.password !== v.confirm) {
      this.error.set('Passwords do not match.');
      this.toast.show('Passwords do not match.', 'error');
      return;
    }
    this.run(() => this.auth.register({ fullName: v.fullName, email: v.email, password: v.password }), () => {
      this.toast.show('Account created! Please verify your email.', 'success');
    });
  }

  forgot() {
    this.run(() => this.auth.forgot(this.forgotForm.getRawValue().email), () => {
      this.toast.show('Password reset link sent to your email.', 'success');
    });
  }

  reset() {
    const v = this.resetForm.getRawValue();
    if (v.password !== v.confirm) {
      this.error.set('Passwords do not match.');
      return;
    }
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error.set('The reset link is missing its token.');
      return;
    }
    this.run(
      () => this.auth.reset(token, v.password),
      () => {
        this.toast.show('Password updated successfully. Please sign in.', 'success');
        this.router.navigateByUrl('/login');
      },
    );
  }
}
