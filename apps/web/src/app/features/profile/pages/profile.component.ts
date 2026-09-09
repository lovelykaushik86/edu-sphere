import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { AuthService } from '../../../core/auth/auth.service';
import { PortalDataService } from '../../../core/api/portal-data.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-profile',
  standalone: true,
  imports: [FormsModule, MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Profile" [breadcrumbs]="['Home', 'Profile']">
      <div class="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences</p>
      </div>

      <div class="profile-grid">
        <!-- Left Summary Card -->
        <aside class="profile-card summary-card">
          <div class="avatar-edit-wrap">
            <img [src]="avatarUrl()" alt="Alex Johnson" class="profile-avatar-img" />
            <button class="camera-btn" title="Change Photo">📷</button>
          </div>
          <h2>{{ fullName() }}</h2>
          <span class="email-text">{{ email() }}</span>
          <span class="role-badge">Student</span>
          <small class="member-since">Member since Mar 2025</small>
        </aside>

        <!-- Right Form Card -->
        <main class="profile-card form-card">
          <!-- Profile Tabs -->
          <nav class="profile-tabs">
            <button [class.active]="tab() === 'personal'" (click)="tab.set('personal')">Personal Information</button>
            <button [class.active]="tab() === 'preferences'" (click)="tab.set('preferences')">Preferences</button>
            <button [class.active]="tab() === 'security'" (click)="tab.set('security')">Security</button>
          </nav>

          @if (tab() === 'personal') {
            <form (ngSubmit)="saveProfile()" class="profile-form">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="fullName" name="fullName" placeholder="Alex Johnson" />
              </div>

              <div class="form-group">
                <div class="label-row">
                  <label>Email Address</label>
                  <button type="button" class="change-link" (click)="changeEmailPrompt()">Change</button>
                </div>
                <input type="email" [value]="email()" disabled class="disabled-input" />
              </div>

              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" [(ngModel)]="phoneNumber" name="phoneNumber" placeholder="+1 234 567 8900" />
              </div>

              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="location" name="location" placeholder="New York, USA" />
              </div>

              <div class="form-group">
                <label>Bio</label>
                <textarea rows="3" [(ngModel)]="bio" name="bio" placeholder="Passionate about learning new technologies and building amazing products."></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" (click)="resetForm()">Cancel</button>
                <button type="submit" class="save-btn" [disabled]="saving()">
                  {{ saving() ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>
            </form>
          } @else if (tab() === 'preferences') {
            <div class="pref-pane">
              <h3>Notification Preferences</h3>
              <label class="check-row"><input type="checkbox" checked /> Email notifications for upcoming assignment deadlines</label>
              <label class="check-row"><input type="checkbox" checked /> Email updates when instructors post announcements</label>
              <label class="check-row"><input type="checkbox" /> Weekly learning progress summary</label>
            </div>
          } @else {
            <div class="security-pane">
              <h3>Security & Password</h3>
              <p>Ensure your account is protected with a strong password.</p>
              <button class="outline-action-btn" (click)="resetPasswordModal()">Change Password</button>
            </div>
          }
        </main>
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .profile-header {
      margin-bottom: 24px;
    }
    .profile-header h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    .profile-header p {
      font-size: 12px;
      color: #64748b;
      margin: 4px 0 0;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 24px;
      align-items: start;
    }

    .profile-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }

    /* Left Card */
    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .avatar-edit-wrap {
      position: relative;
      margin-bottom: 14px;
    }
    .profile-avatar-img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e0edff;
    }
    .camera-btn {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1868db;
      color: white;
      border: 2px solid white;
      font-size: 13px;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .summary-card h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .email-text {
      font-size: 11.5px;
      color: #64748b;
      margin: 3px 0 10px;
    }
    .role-badge {
      background: #eff6ff;
      color: #1868db;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 12px;
      border-radius: 999px;
      border: 1px solid #bfdbfe;
    }
    .member-since {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 14px;
    }

    /* Right Form Card */
    .profile-tabs {
      display: flex;
      gap: 20px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .profile-tabs button {
      background: none;
      border: none;
      padding: 8px 0 12px;
      font-size: 12.5px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      position: relative;
    }
    .profile-tabs button.active {
      color: #1868db;
    }
    .profile-tabs button.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1868db;
    }

    /* Form */
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 11px;
      font-weight: 600;
      color: #334155;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .change-link {
      background: none;
      border: none;
      color: #1868db;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }
    .form-group input, .form-group textarea {
      height: 38px;
      border: 1px solid #dce5f1;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 12px;
      color: #0f172a;
      outline: none;
      font-family: inherit;
    }
    .form-group textarea {
      height: auto;
      padding: 10px 12px;
      resize: vertical;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: #1868db;
      box-shadow: 0 0 0 3px rgba(24, 104, 219, 0.1);
    }
    .disabled-input {
      background: #f8fafc;
      color: #64748b;
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 10px;
    }
    .cancel-btn {
      height: 36px;
      padding: 0 16px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .save-btn {
      height: 36px;
      padding: 0 20px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .save-btn:hover {
      background: #1459be;
    }

    .check-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #334155;
      margin-bottom: 12px;
    }
    .outline-action-btn {
      height: 34px;
      padding: 0 14px;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      color: #1868db;
      font-weight: 600;
      font-size: 11.5px;
      cursor: pointer;
    }

    @media (max-width: 860px) {
      .profile-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private portal = inject(PortalDataService);
  private toast = inject(ToastService);

  user = this.auth.user;

  tab = signal<'personal' | 'preferences' | 'security'>('personal');
  saving = signal(false);

  fullName = signal(this.user()?.fullName || 'Alex Johnson');
  email = signal(this.user()?.email || 'alex@example.com');
  phoneNumber = signal(this.user()?.phoneNumber || '+1 234 567 8900');
  location = signal(this.user()?.location || 'New York, USA');
  bio = signal(this.user()?.bio || 'Passionate about learning new technologies and building amazing products.');
  avatarUrl = signal(this.user()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80');

  saveProfile() {
    this.saving.set(true);
    const payload = {
      fullName: this.fullName(),
      phoneNumber: this.phoneNumber(),
      location: this.location(),
      bio: this.bio(),
    };

    this.portal.updateProfile(payload).subscribe(() => {
      this.saving.set(false);
      this.auth.updateCurrentUser(payload);
      this.toast.show('Profile updated successfully!', 'success');
    });
  }

  resetForm() {
    const current = this.user();
    if (current) {
      this.fullName.set(current.fullName);
      this.phoneNumber.set(current.phoneNumber || '');
      this.location.set(current.location || '');
      this.bio.set(current.bio || '');
    }
    this.toast.show('Changes reverted', 'info');
  }

  changeEmailPrompt() {
    this.toast.show('A verification code has been sent to confirm email change.', 'info');
  }

  resetPasswordModal() {
    this.toast.show('Password reset link sent to your verified email.', 'info');
  }
}
