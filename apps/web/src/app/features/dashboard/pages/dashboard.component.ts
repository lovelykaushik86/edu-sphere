import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService, DashboardData } from '../../../core/api/portal-data.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'edu-dashboard',
  standalone: true,
  imports: [RouterLink, MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Dashboard" [breadcrumbs]="['Home', 'Dashboard']">
      <!-- Welcome Banner -->
      <section class="welcome-banner">
        <h1>Good Morning, {{ firstName() }}! 👋</h1>
        <p>Let’s continue your learning journey.</p>
      </section>

      <!-- Stats Row -->
      <section class="stats-row">
        <article class="stat-card">
          <div class="stat-icon-wrap blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10M6 10h10"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ data()?.stats?.enrolledCourses ?? 5 }}</span>
            <span class="stat-label">Enrolled Courses</span>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon-wrap cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ data()?.stats?.inProgress ?? 3 }}</span>
            <span class="stat-label">In Progress</span>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon-wrap green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ data()?.stats?.completed ?? 2 }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon-wrap gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ data()?.stats?.certificates ?? 1 }}</span>
            <span class="stat-label">Certificates</span>
          </div>
        </article>
      </section>

      <!-- Content Grid -->
      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="grid-main">
          <!-- Continue Learning -->
          <section class="section-block">
            <div class="section-header">
              <h2>Continue Learning</h2>
              <a routerLink="/courses/enrolled" class="view-all-link">View All</a>
            </div>

            @if (data()?.continueLearning; as cl) {
              <div class="continue-course-card">
                <div class="course-badge" [class]="cl.colorScheme || 'red'">
                  {{ cl.iconText || 'A' }}
                </div>
                <div class="course-details">
                  <div class="course-titles">
                    <b>{{ cl.title }}</b>
                    <span class="subtext">{{ cl.currentModule }}</span>
                  </div>
                  <div class="progress-bar-wrap">
                    <div class="progress-track">
                      <div class="progress-fill" [style.width.%]="cl.progressPercent"></div>
                    </div>
                    <span class="progress-num">{{ cl.progressPercent }}%</span>
                  </div>
                </div>
                <button class="continue-btn" (click)="continueCourse(cl.slug)">Continue</button>
              </div>
            }
          </section>

          <!-- Recommended for You -->
          <section class="section-block">
            <div class="section-header">
              <h2>Recommended for You</h2>
              <a routerLink="/courses" class="view-all-link">View All</a>
            </div>

            <div class="recommended-cards">
              @for (rc of data()?.recommendedCourses; track rc.id) {
                <div class="rec-card" (click)="continueCourse(rc.slug)">
                  <div class="rec-banner" [class]="rc.colorScheme">
                    <span class="rec-banner-icon">{{ rc.iconText }}</span>
                  </div>
                  <div class="rec-content">
                    <b>{{ rc.title }}</b>
                    <p>{{ rc.description }}</p>
                    <div class="rating-row">
                      <span class="stars">★</span>
                      <span class="score">{{ rc.rating }} ({{ (rc.reviewsCount / 1000).toFixed(1) }}K)</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <aside class="grid-sidebar">
          <!-- Your Progress -->
          <div class="sidebar-card">
            <h2>Your Progress</h2>
            <div class="donut-chart-wrap">
              <div class="donut-chart">
                <div class="donut-center">
                  <span class="donut-percent">{{ data()?.progressCard?.overallProgress ?? 60 }}%</span>
                  <span class="donut-sub">Overall Progress</span>
                </div>
              </div>
            </div>
            <div class="mini-metrics">
              <div class="mini-item">
                <span class="val in-progress">{{ data()?.progressCard?.inProgress ?? 3 }}</span>
                <span class="lbl">In Progress</span>
              </div>
              <div class="mini-item">
                <span class="val completed">{{ data()?.progressCard?.completed ?? 2 }}</span>
                <span class="lbl">Completed</span>
              </div>
              <div class="mini-item">
                <span class="val not-started">{{ data()?.progressCard?.notStarted ?? 0 }}</span>
                <span class="lbl">Not Started</span>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="sidebar-card">
            <h2>Upcoming Deadlines</h2>
            <div class="deadlines-list">
              @for (item of data()?.upcomingDeadlines; track item.id) {
                <div class="deadline-item">
                  <div class="deadline-icon-box" [class]="item.eventType.toLowerCase()">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div class="deadline-details">
                    <b>{{ item.title }}</b>
                    <span>{{ item.courseTitle }} · {{ item.dueDate }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </aside>
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .welcome-banner {
      margin-bottom: 24px;
    }
    .welcome-banner h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .welcome-banner p {
      color: #64748b;
      font-size: 12.5px;
      margin: 4px 0 0;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap.blue { background: #eff6ff; color: #1868db; }
    .stat-icon-wrap.cyan { background: #ecfeff; color: #0891b2; }
    .stat-icon-wrap.green { background: #f0fdf4; color: #16a34a; }
    .stat-icon-wrap.gold { background: #fffbeb; color: #d97706; }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }
    .stat-label {
      font-size: 11px;
      color: #64748b;
      margin-top: 3px;
    }

    /* Grid Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
    }
    .grid-main {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .section-header h2 {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
    .view-all-link {
      font-size: 11px;
      color: #1868db;
      font-weight: 600;
      text-decoration: none;
    }

    /* Continue Learning Card */
    .continue-course-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .course-badge {
      width: 52px;
      height: 52px;
      border-radius: 6px;
      display: grid;
      place-items: center;
      font-size: 26px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
    }
    .course-badge.red { background: linear-gradient(135deg, #e11d48, #be123c); }
    .course-badge.navy { background: linear-gradient(135deg, #0f172a, #1e293b); }
    .course-details {
      flex: 1;
      min-width: 0;
    }
    .course-titles b {
      display: block;
      font-size: 13.5px;
      color: #0f172a;
    }
    .course-titles .subtext {
      display: block;
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .progress-bar-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
    }
    .progress-track {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #1868db;
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .progress-num {
      font-size: 10.5px;
      font-weight: 700;
      color: #1868db;
      width: 32px;
      text-align: right;
    }
    .continue-btn {
      height: 34px;
      padding: 0 16px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
    }
    .continue-btn:hover {
      background: #1459be;
    }

    /* Recommended Cards */
    .recommended-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .rec-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .rec-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }
    .rec-banner {
      height: 85px;
      display: grid;
      place-items: center;
      color: white;
    }
    .rec-banner.navy { background: linear-gradient(135deg, #0b1f44, #1e3a8a); }
    .rec-banner.blue { background: linear-gradient(135deg, #1868db, #60a5fa); }
    .rec-banner.gold { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .rec-banner-icon {
      font-size: 32px;
    }
    .rec-content {
      padding: 12px;
    }
    .rec-content b {
      display: block;
      font-size: 12.5px;
      color: #0f172a;
    }
    .rec-content p {
      font-size: 10.5px;
      color: #64748b;
      margin: 4px 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
    }
    .stars { color: #f59e0b; }
    .score { color: #64748b; font-weight: 500; }

    /* Right Sidebar Widgets */
    .grid-sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .sidebar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .sidebar-card h2 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 14px;
    }

    /* Donut Chart */
    .donut-chart-wrap {
      display: flex;
      justify-content: center;
      margin: 8px 0 16px;
    }
    .donut-chart {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: conic-gradient(#10b981 0% 60%, #e2e8f0 60% 100%);
      display: grid;
      place-items: center;
    }
    .donut-center {
      width: 82px;
      height: 82px;
      background: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .donut-percent {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .donut-sub {
      font-size: 8px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .mini-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      text-align: center;
    }
    .mini-item .val {
      display: block;
      font-size: 15px;
      font-weight: 800;
    }
    .mini-item .val.in-progress { color: #1868db; }
    .mini-item .val.completed { color: #10b981; }
    .mini-item .val.not-started { color: #94a3b8; }
    .mini-item .lbl {
      font-size: 9px;
      color: #64748b;
      margin-top: 2px;
      display: block;
    }

    /* Deadlines List */
    .deadlines-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .deadline-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f8fafc;
    }
    .deadline-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .deadline-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      background: #eff6ff;
      color: #1868db;
    }
    .deadline-icon-box.project_due { background: #fef2f2; color: #dc2626; }
    .deadline-icon-box.quiz { background: #fffbeb; color: #d97706; }
    .deadline-details b {
      display: block;
      font-size: 11.5px;
      color: #0f172a;
    }
    .deadline-details span {
      display: block;
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .stats-row { grid-template-columns: 1fr; }
      .recommended-cards { grid-template-columns: 1fr; }
      .continue-course-card { flex-direction: column; align-items: stretch; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private portal = inject(PortalDataService);
  private auth = inject(AuthService);
  private router = inject(Router);

  data = signal<DashboardData | null>(null);

  ngOnInit() {
    this.portal.getDashboard().subscribe((res) => {
      this.data.set(res);
    });
  }

  firstName = () => {
    const fullName = this.auth.user()?.fullName || this.data()?.user?.fullName || 'Alex Johnson';
    return fullName.split(' ')[0] || 'Alex';
  };

  continueCourse(slug: string) {
    this.router.navigate(['/courses', slug]);
  }
}
