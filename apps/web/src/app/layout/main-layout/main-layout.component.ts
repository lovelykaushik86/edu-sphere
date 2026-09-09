import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BrandComponent } from '../../shared/ui/brand/brand.component';
import { EduAvatarComponent } from '../../shared/ui/avatar/edu-avatar.component';
import { EduBreadcrumbComponent } from '../../shared/ui/breadcrumb/edu-breadcrumb.component';
import { ToastComponent } from '../../shared/ui/toast/toast.component';
import { AuthService } from '../../core/auth/auth.service';
import { PortalDataService, NotificationItem } from '../../core/api/portal-data.service';

@Component({
  selector: 'edu-main-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BrandComponent, EduAvatarComponent, EduBreadcrumbComponent, ToastComponent],
  template: `
    <div class="portal-root" [class.sidebar-collapsed]="isCollapsed()" [class.mobile-open]="mobileOpen()">
      <!-- Mobile Backdrop -->
      @if (mobileOpen()) {
        <div class="mobile-backdrop" (click)="toggleMobile()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="brand-link">
            <edu-brand [compact]="isCollapsed()" [hideTagline]="isCollapsed()" />
          </a>
          <button class="collapse-btn" (click)="toggleCollapse()" title="Toggle Sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="sidebar-scroll">
          <nav class="nav-section">
            <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobile()" title="Dashboard">
              <span class="nav-icon">⌂</span>
              <span class="nav-text">Dashboard</span>
            </a>
            <a routerLink="/courses" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMobile()" title="My Courses">
              <span class="nav-icon">▤</span>
              <span class="nav-text">My Courses</span>
            </a>
            <a routerLink="/courses/enrolled" routerLinkActive="active" (click)="closeMobile()" title="Enrolled Courses">
              <span class="nav-icon">▧</span>
              <span class="nav-text">Enrolled Courses</span>
            </a>
            <a routerLink="/assignments" routerLinkActive="active" (click)="closeMobile()" title="Assignments">
              <span class="nav-icon">☑</span>
              <span class="nav-text">Assignments</span>
            </a>
            <a routerLink="/certificates" routerLinkActive="active" (click)="closeMobile()" title="Certificates">
              <span class="nav-icon">▱</span>
              <span class="nav-text">Certificates</span>
            </a>
            <a routerLink="/messages" routerLinkActive="active" (click)="closeMobile()" title="Messages">
              <span class="nav-icon">◌</span>
              <span class="nav-text">Messages</span>
            </a>
            <a routerLink="/calendar" routerLinkActive="active" (click)="closeMobile()" title="Calendar">
              <span class="nav-icon">□</span>
              <span class="nav-text">Calendar</span>
            </a>
            <a routerLink="/organizations" routerLinkActive="active" (click)="closeMobile()" title="Organizations">
              <span class="nav-icon">🏢</span>
              <span class="nav-text">Organizations</span>
            </a>
          </nav>

          <div class="nav-label">
            <span>ACCOUNT</span>
          </div>

          <nav class="nav-section">
            <a routerLink="/profile" routerLinkActive="active" (click)="closeMobile()" title="Profile">
              <span class="nav-icon">👤</span>
              <span class="nav-text">Profile</span>
            </a>
            <a routerLink="/settings" routerLinkActive="active" (click)="closeMobile()" title="Settings">
              <span class="nav-icon">⚙</span>
              <span class="nav-text">Settings</span>
            </a>
            <a routerLink="/help" routerLinkActive="active" (click)="closeMobile()" title="Help & Support">
              <span class="nav-icon">◉</span>
              <span class="nav-text">Help & Support</span>
            </a>
          </nav>
        </div>

        @if (!isCollapsed()) {
          <div class="upgrade-card">
            <div class="upgrade-header">
              <b>Upgrade to Pro</b>
              <span>Get access to all courses</span>
            </div>
            <button class="upgrade-btn" (click)="upgradePro()">Upgrade Now</button>
          </div>
        }
      </aside>

      <!-- Main Shell -->
      <div class="main-shell">
        <!-- Header -->
        <header class="top-header">
          <button class="mobile-toggle" (click)="toggleMobile()" aria-label="Toggle navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div class="search-box">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search for courses, topics, or instructors…" (keydown.enter)="onSearch($event)" />
          </div>

          <div class="header-actions">
            <!-- Notifications Bell -->
            <div class="notification-trigger">
              <button class="icon-button" (click)="toggleNotifications()" title="Notifications">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                @if (unreadCount() > 0) {
                  <span class="badge">{{ unreadCount() }}</span>
                }
              </button>

              <!-- Notifications Dropdown (Screen 8) -->
              @if (notificationsOpen()) {
                <div class="notifications-dropdown">
                  <div class="dropdown-header">
                    <div class="title-wrap">
                      <b>Notifications</b>
                      @if (unreadCount() > 0) {
                        <span class="count-pill">{{ unreadCount() }}</span>
                      }
                    </div>
                    <button class="text-link" (click)="markAllRead()">Mark all as read</button>
                  </div>
                  <div class="notifications-list">
                    @for (item of notifications(); track item.id) {
                      <div class="notification-item" [class.unread]="!item.isRead">
                        <div class="notif-bullet"></div>
                        <div class="notif-body">
                          <b>{{ item.title }}</b>
                          <p>{{ item.message }}</p>
                          <small>{{ item.createdAt }}</small>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="dropdown-footer">
                    <a routerLink="/notifications" (click)="notificationsOpen.set(false)">View All Notifications</a>
                  </div>
                </div>
              }
            </div>

            <!-- User Menu -->
            <div class="user-profile-menu">
              <a routerLink="/profile" class="user-pill">
                <edu-avatar [src]="user()?.avatarUrl" [initials]="getInitials()" size="md" />
                <div class="user-meta">
                  <span class="name">{{ user()?.fullName || 'Alex Johnson' }}</span>
                  <span class="role">{{ user()?.role || 'Student' }}</span>
                </div>
              </a>
              <button class="logout-btn" (click)="logout()" title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="page-body">
          <div class="breadcrumb-container">
            <edu-breadcrumb [items]="breadcrumbs()" />
          </div>
          <ng-content />
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <p>© 2026 EduSphere LMS · Learning made simple. All rights reserved.</p>
        </footer>
      </div>
    </div>
    <edu-toast />
  `,
  styles: [`
    .portal-root {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      transition: width 0.25s ease-in-out;
      z-index: 50;
    }
    .portal-root.sidebar-collapsed .sidebar {
      width: 72px;
    }
    .sidebar-header {
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .brand-link {
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .collapse-btn {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }
    .portal-root.sidebar-collapsed .collapse-btn {
      transform: rotate(180deg);
    }
    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 10px;
    }
    .nav-label {
      padding: 16px 12px 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.6px;
      color: #94a3b8;
    }
    .portal-root.sidebar-collapsed .nav-label {
      display: none;
    }
    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .nav-section a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 12px;
      border-radius: 6px;
      color: #475569;
      font-size: 12.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s;
    }
    .nav-section a:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .nav-section a.active {
      background: #e8f1fd;
      color: #1868db;
      font-weight: 600;
    }
    .nav-icon {
      font-size: 15px;
      display: inline-block;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }
    .portal-root.sidebar-collapsed .nav-text {
      display: none;
    }
    .portal-root.sidebar-collapsed .nav-section a {
      justify-content: center;
      padding: 10px 0;
    }

    /* Upgrade Card */
    .upgrade-card {
      margin: 12px 14px 16px;
      padding: 14px;
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 8px;
      border: 1px solid #bfdbfe;
    }
    .upgrade-header b {
      display: block;
      font-size: 12px;
      color: #1e3a8a;
      font-weight: 700;
    }
    .upgrade-header span {
      display: block;
      font-size: 10.5px;
      color: #3b82f6;
      margin-top: 2px;
    }
    .upgrade-btn {
      width: 100%;
      height: 28px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 10px;
      cursor: pointer;
    }

    /* Main Shell */
    .main-shell {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    /* Header */
    .top-header {
      height: 68px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      gap: 20px;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: #475569;
      cursor: pointer;
      padding: 4px;
    }
    .search-box {
      position: relative;
      width: 380px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    .search-box input {
      width: 100%;
      height: 36px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 0 14px 0 36px;
      font-size: 12px;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
    }
    .search-box input:focus {
      background: #ffffff;
      border-color: #1868db;
      box-shadow: 0 0 0 3px rgba(24, 104, 219, 0.1);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .notification-trigger {
      position: relative;
    }
    .icon-button {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .icon-button:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .icon-button .badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #ef4444;
      color: white;
      font-size: 9px;
      font-weight: 700;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 2px solid #ffffff;
    }

    /* Notifications Dropdown */
    .notifications-dropdown {
      position: absolute;
      right: 0;
      top: 48px;
      width: 330px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
      z-index: 100;
      animation: dropDown 0.2s ease-out;
    }
    .dropdown-header {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .title-wrap b {
      font-size: 13px;
      color: #0f172a;
    }
    .count-pill {
      background: #fee2e2;
      color: #dc2626;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 10px;
    }
    .text-link {
      background: none;
      border: none;
      color: #1868db;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
    }
    .notifications-list {
      max-height: 280px;
      overflow-y: auto;
    }
    .notification-item {
      display: flex;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid #f8fafc;
      transition: background 0.15s;
    }
    .notification-item:hover {
      background: #f8fafc;
    }
    .notification-item.unread {
      background: #f0f7ff;
    }
    .notif-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1868db;
      margin-top: 6px;
      flex-shrink: 0;
    }
    .notification-item:not(.unread) .notif-bullet {
      background: #cbd5e1;
    }
    .notif-body b {
      font-size: 12px;
      color: #1e293b;
      display: block;
    }
    .notif-body p {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0 4px;
      line-height: 1.4;
    }
    .notif-body small {
      font-size: 9.5px;
      color: #94a3b8;
    }
    .dropdown-footer {
      padding: 10px;
      border-top: 1px solid #f1f5f9;
      text-align: center;
    }
    .dropdown-footer a {
      font-size: 11.5px;
      color: #1868db;
      font-weight: 600;
      text-decoration: none;
    }

    /* User Profile */
    .user-profile-menu {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .user-pill:hover {
      background: #f1f5f9;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
    }
    .user-meta .name {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }
    .user-meta .role {
      font-size: 10px;
      color: #64748b;
    }
    .logout-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .logout-btn:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #fecaca;
    }

    /* Page Body */
    .page-body {
      padding: 24px 32px 40px;
      max-width: 1280px;
      width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
      flex: 1;
    }
    .breadcrumb-container {
      margin-bottom: 20px;
    }

    /* Footer */
    .app-footer {
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 16px 32px;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }

    @keyframes dropDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive */
    @media (max-width: 960px) {
      .top-header { padding: 0 16px; }
      .page-body { padding: 16px; }
      .search-box { width: 240px; }
      .sidebar {
        position: fixed;
        left: -260px;
      }
      .portal-root.mobile-open .sidebar {
        left: 0;
      }
      .mobile-toggle {
        display: block;
      }
      .mobile-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 45;
      }
    }
  `],
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private portal = inject(PortalDataService);

  pageTitle = input('Dashboard');
  breadcrumbs = input<string[]>(['Home', 'Dashboard']);

  isCollapsed = signal(false);
  mobileOpen = signal(false);
  notificationsOpen = signal(false);
  notifications = signal<NotificationItem[]>([]);
  unreadCount = signal(1);

  user = this.auth.user;

  ngOnInit() {
    this.portal.getNotifications().subscribe((res) => {
      this.notifications.set(res.notifications);
      this.unreadCount.set(res.unreadCount);
    });
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  toggleMobile() {
    this.mobileOpen.set(!this.mobileOpen());
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }

  toggleNotifications() {
    this.notificationsOpen.set(!this.notificationsOpen());
  }

  markAllRead() {
    this.portal.markAllNotificationsRead().subscribe(() => {
      this.unreadCount.set(0);
      this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
    });
  }

  getInitials(): string {
    const name = this.user()?.fullName || 'Alex Johnson';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.router.navigate(['/courses'], { queryParams: { search: input.value } });
    }
  }

  upgradePro() {
    this.router.navigate(['/organizations']);
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
