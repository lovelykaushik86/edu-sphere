import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { AuthService } from './auth.service';
import { BrandComponent } from './brand.component';
@Component({ selector: 'edu-auth-page', imports: [ReactiveFormsModule, RouterLink, NgIf, NgSwitch, NgSwitchCase, BrandComponent], template: `
<main class="auth-shell" [class.compact]="mode() === 'forgot' || mode() === 'reset' || mode() === 'verify'">
  <section class="auth-card"><div class="form-pane"><edu-brand />
    <ng-container [ngSwitch]="mode()">
      <form *ngSwitchCase="'login'" [formGroup]="loginForm" (ngSubmit)="login()"><h1>Welcome Back</h1><p>Sign in to your account to continue</p>
        <label>Email address<input type="email" placeholder="you@example.com" formControlName="email"></label><label>Password<input type="password" placeholder="••••••••" formControlName="password"></label>
        <div class="form-row"><label class="check"><input type="checkbox"> Remember me</label><a routerLink="/forgot-password">Forgot password?</a></div><button [disabled]="loginForm.invalid || busy()">{{busy() ? 'Signing in…' : 'Sign In'}}</button><div class="or">or continue with</div><button type="button" class="social">G&nbsp;&nbsp; Continue with Google</button><button type="button" class="social">▦&nbsp;&nbsp; Continue with Microsoft</button><p class="bottom">Don’t have an account? <a routerLink="/register">Create one</a></p></form>
      <form *ngSwitchCase="'register'" [formGroup]="registerForm" (ngSubmit)="register()"><h1>Create Your Account</h1><p>Join thousands of learners and start your journey</p>
        <label>Full name<input placeholder="Alex Johnson" formControlName="fullName"></label><label>Email address<input type="email" placeholder="you@example.com" formControlName="email"></label><label>Password<input type="password" placeholder="At least 8 characters" formControlName="password"></label><label>Confirm password<input type="password" placeholder="Repeat password" formControlName="confirm"></label><label class="check"><input type="checkbox" formControlName="terms"> I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a></label><button [disabled]="registerForm.invalid || busy()">{{busy() ? 'Creating account…' : 'Create Account'}}</button><p class="bottom">Already have an account? <a routerLink="/login">Sign in</a></p></form>
      <form *ngSwitchCase="'forgot'" [formGroup]="forgotForm" (ngSubmit)="forgot()"><h1>Reset Your Password</h1><p>Enter your email and we’ll send you a link to reset your password.</p><label>Email address<input type="email" placeholder="you@example.com" formControlName="email"></label><button [disabled]="forgotForm.invalid || busy()">{{busy() ? 'Sending…' : 'Send Reset Link'}}</button><p class="bottom"><a routerLink="/login">← Back to login</a></p></form>
      <form *ngSwitchCase="'reset'" [formGroup]="resetForm" (ngSubmit)="reset()"><h1>Choose a New Password</h1><p>Set a secure password for your EduSphere account.</p><label>New password<input type="password" formControlName="password"></label><label>Confirm password<input type="password" formControlName="confirm"></label><button [disabled]="resetForm.invalid || busy()">Update Password</button></form>
      <div *ngSwitchCase="'verify'" class="status"><div class="status-icon">✉</div><h1>{{message() || 'Verifying your email…'}}</h1><p>We’re setting up your account securely.</p><a routerLink="/login"><button>Back to login</button></a></div>
    </ng-container><p *ngIf="message() && mode() !== 'verify'" class="notice">{{message()}} <a *ngIf="actionUrl()" [href]="actionUrl()">Open development link</a></p><p *ngIf="error()" class="error">{{error()}}</p>
  </div>
  <aside class="auth-visual"><div class="visual-copy"><h2>{{mode()==='register' ? 'Learn Without Limits' : 'Your Learning Journey Starts Here'}}</h2><p>Access world-class courses, learn from experts and build a better future.</p><div class="metrics"><b>10K+<small>Students</small></b><b>500+<small>Courses</small></b><b>100+<small>Expert Trainers</small></b></div></div></aside>
  </section></main>`,
}) export class AuthPageComponent {
  private route=inject(ActivatedRoute); private router=inject(Router); private auth=inject(AuthService); private fb=inject(FormBuilder);
  mode=signal(this.route.snapshot.data['mode'] || 'login'); busy=signal(false); message=signal(''); error=signal(''); actionUrl=signal('');
  loginForm=this.fb.nonNullable.group({email:['',[Validators.required,Validators.email]],password:['',[Validators.required,Validators.minLength(8)]]});
  registerForm=this.fb.nonNullable.group({fullName:['',Validators.required],email:['',[Validators.required,Validators.email]],password:['',[Validators.required,Validators.minLength(8)]],confirm:['',Validators.required],terms:[false,Validators.requiredTrue]});
  forgotForm=this.fb.nonNullable.group({email:['',[Validators.required,Validators.email]]}); resetForm=this.fb.nonNullable.group({password:['',[Validators.required,Validators.minLength(8)]],confirm:['',Validators.required]});
  constructor(){ if(this.mode()==='verify'){ const token=this.route.snapshot.queryParamMap.get('token'); if(token) this.auth.verify(token).subscribe({next:r=>this.message.set(r.message),error:e=>this.message.set(e.error?.message || 'This verification link is invalid or expired.')}); } }
  private run(fn:()=>any, done?:()=>void){this.error.set('');this.message.set('');this.actionUrl.set('');this.busy.set(true);fn().subscribe({next:(r:any)=>{this.busy.set(false); if(done) done(); else {this.message.set(r.message || 'Success.');this.actionUrl.set(r.developmentVerificationUrl || r.developmentResetUrl || '');}},error:(e:any)=>{this.busy.set(false);this.error.set(e.error?.message || 'Something went wrong. Please try again.');}});}
  login(){this.run(()=>this.auth.login(this.loginForm.getRawValue()),()=>this.router.navigateByUrl('/dashboard'));}
  register(){const v=this.registerForm.getRawValue();if(v.password!==v.confirm){this.error.set('Passwords do not match.');return;}this.run(()=>this.auth.register({fullName:v.fullName,email:v.email,password:v.password}));}
  forgot(){this.run(()=>this.auth.forgot(this.forgotForm.getRawValue().email));}
  reset(){const v=this.resetForm.getRawValue();if(v.password!==v.confirm){this.error.set('Passwords do not match.');return;}const token=this.route.snapshot.queryParamMap.get('token');if(!token){this.error.set('The reset link is missing its token.');return;}this.run(()=>this.auth.reset(token,v.password),()=>this.router.navigateByUrl('/login'));}
}
