import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService } from '../../../core/api/portal-data.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-course-detail',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <edu-main-layout [pageTitle]="course()?.title || 'Course Details'" [breadcrumbs]="['Home', 'Courses', course()?.title || 'Course Details']">
      <!-- Course Hero Card -->
      <section class="course-hero">
        <div class="hero-left">
          <div class="course-large-icon" [class]="course()?.colorScheme || 'red'">
            {{ course()?.iconText || 'A' }}
          </div>
          <div class="hero-text">
            <h1>{{ course()?.title }}</h1>
            <p>{{ course()?.description }}</p>
            <div class="hero-meta">
              <span class="badge-pill">{{ course()?.badge || 'Beginner' }}</span>
              <span class="rating-badge">★ {{ course()?.rating }} ({{ course()?.reviewsCount }})</span>
              <span class="updated-text">Last updated {{ course()?.lastUpdated || 'Mar 2025' }}</span>
            </div>
          </div>
        </div>
        <div class="hero-action">
          <button class="primary-action-btn" (click)="onContinue()">Continue Learning</button>
        </div>
      </section>

      <!-- Course Tabs -->
      <nav class="course-tabs">
        <button [class.active]="activeTab() === 'overview'" (click)="setTab('overview')">Overview</button>
        <button [class.active]="activeTab() === 'curriculum'" (click)="setTab('curriculum')">Curriculum</button>
        <button [class.active]="activeTab() === 'instructors'" (click)="setTab('instructors')">Instructors</button>
        <button [class.active]="activeTab() === 'reviews'" (click)="setTab('reviews')">Reviews</button>
      </nav>

      <!-- Tab Content -->
      @if (activeTab() === 'curriculum') {
        <section class="curriculum-view">
          <div class="curriculum-header">
            <div class="curriculum-summary">
              <b>Course Content</b>
              <span>12 modules · 48 lessons · 12h 30m total length</span>
            </div>
            <button class="expand-all-btn" (click)="toggleAllModules()">
              {{ allExpanded() ? 'Collapse All' : 'Expand All' }}
            </button>
          </div>

          <!-- Modules List -->
          <div class="modules-accordion">
            @for (mod of course()?.modules; track mod.id; let i = $index) {
              <div class="module-panel" [class.open]="mod.isExpanded">
                <div class="module-header" (click)="toggleModule(mod)">
                  <div class="module-title-wrap">
                    <span class="chevron" [class.rotated]="mod.isExpanded">›</span>
                    <b>{{ mod.title }}</b>
                  </div>
                  <span class="module-meta">{{ mod.duration }}</span>
                </div>

                @if (mod.isExpanded) {
                  <div class="lessons-list">
                    @for (lesson of mod.lessons; track lesson.id) {
                      <div class="lesson-row" (click)="selectLesson(lesson)">
                        <div class="lesson-left">
                          <span class="lesson-icon">
                            @if (lesson.type === 'QUIZ') {
                              ❓
                            } @else if (lesson.type === 'TEXT') {
                              📄
                            } @else {
                              ▶
                            }
                          </span>
                          <span class="lesson-title" [class.done]="lesson.completed">{{ lesson.title }}</span>
                        </div>
                        <div class="lesson-right">
                          <span class="lesson-duration">{{ lesson.duration }}</span>
                          <button
                            class="check-btn"
                            [class.checked]="lesson.completed"
                            (click)="toggleComplete(lesson, $event)"
                            [title]="lesson.completed ? 'Mark incomplete' : 'Mark complete'"
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </section>
      } @else if (activeTab() === 'overview') {
        <section class="overview-view">
          <h3>About this Course</h3>
          <p>{{ course()?.description }}</p>
          <div class="overview-features">
            <div class="feat-item">✓ 48 on-demand video lectures</div>
            <div class="feat-item">✓ 12 downloadable resources and project templates</div>
            <div class="feat-item">✓ Full lifetime access on mobile and desktop</div>
            <div class="feat-item">✓ Certificate of completion</div>
          </div>
        </section>
      } @else if (activeTab() === 'instructors') {
        <section class="instructors-view">
          <div class="instructor-card">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80" alt="Sarah Wilson" class="inst-avatar" />
            <div>
              <h3>Sarah Wilson</h3>
              <span class="inst-title">Lead Web Architect & Angular GDE</span>
              <p>Over 10 years of experience designing enterprise software and mentoring thousands of developers worldwide.</p>
            </div>
          </div>
        </section>
      } @else {
        <section class="reviews-view">
          <h3>Student Feedback</h3>
          <div class="overall-rating-card">
            <div class="big-score">4.8</div>
            <div>
              <div class="stars">★★★★★</div>
              <span>Based on 1,200 student ratings</span>
            </div>
          </div>
        </section>
      }
    </edu-main-layout>
  `,
  styles: [`
    /* Course Hero */
    .course-hero {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      margin-bottom: 20px;
    }
    .hero-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .course-large-icon {
      width: 68px;
      height: 68px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      font-size: 36px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
    }
    .course-large-icon.red { background: linear-gradient(135deg, #e11d48, #be123c); }
    .course-large-icon.navy { background: linear-gradient(135deg, #0f172a, #1e293b); }
    .course-large-icon.blue { background: linear-gradient(135deg, #1868db, #3b82f6); }
    .course-large-icon.gold { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .hero-text h1 {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    .hero-text p {
      font-size: 12px;
      color: #64748b;
      margin: 4px 0 10px;
      max-width: 620px;
    }
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 11px;
    }
    .badge-pill {
      background: #ecfdf5;
      color: #059669;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
    }
    .rating-badge {
      color: #f59e0b;
      font-weight: 700;
    }
    .updated-text {
      color: #94a3b8;
    }
    .primary-action-btn {
      height: 38px;
      padding: 0 20px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    .primary-action-btn:hover {
      background: #1459be;
    }

    /* Tabs */
    .course-tabs {
      display: flex;
      gap: 24px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .course-tabs button {
      background: none;
      border: none;
      padding: 10px 0;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      position: relative;
    }
    .course-tabs button.active {
      color: #1868db;
    }
    .course-tabs button.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1868db;
      border-radius: 2px;
    }

    /* Curriculum View */
    .curriculum-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .curriculum-summary b {
      font-size: 14px;
      color: #0f172a;
      display: block;
    }
    .curriculum-summary span {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .expand-all-btn {
      background: none;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #1868db;
      cursor: pointer;
    }

    /* Modules Accordion */
    .modules-accordion {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .module-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .module-header {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: #ffffff;
      user-select: none;
    }
    .module-header:hover {
      background: #f8fafc;
    }
    .module-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chevron {
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
      color: #64748b;
      transition: transform 0.2s;
    }
    .chevron.rotated {
      transform: rotate(90deg);
    }
    .module-header b {
      font-size: 13px;
      color: #0f172a;
    }
    .module-meta {
      font-size: 11px;
      color: #64748b;
    }

    /* Lessons */
    .lessons-list {
      border-top: 1px solid #f1f5f9;
      background: #fafcff;
    }
    .lesson-row {
      padding: 10px 18px 10px 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
    }
    .lesson-row:last-child {
      border-bottom: none;
    }
    .lesson-row:hover {
      background: #f0f7ff;
    }
    .lesson-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .lesson-icon {
      font-size: 11px;
      color: #64748b;
    }
    .lesson-title {
      font-size: 12px;
      color: #1e293b;
    }
    .lesson-title.done {
      color: #059669;
      font-weight: 500;
    }
    .lesson-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .lesson-duration {
      font-size: 10.5px;
      color: #94a3b8;
    }
    .check-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #cbd5e1;
      background: white;
      color: transparent;
      font-size: 11px;
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }
    .check-btn.checked {
      background: #10b981;
      border-color: #10b981;
      color: white;
    }

    /* Other tab views */
    .overview-view, .instructors-view, .reviews-view {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
    }
    .overview-features {
      margin-top: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .feat-item {
      font-size: 12px;
      color: #334155;
    }
    .instructor-card {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .inst-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }
    .inst-title {
      font-size: 11px;
      color: #64748b;
    }
    .overall-rating-card {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 12px;
    }
    .big-score {
      font-size: 36px;
      font-weight: 800;
      color: #0f172a;
    }
    .stars {
      color: #f59e0b;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .course-hero { flex-direction: column; align-items: stretch; }
      .hero-left { flex-direction: column; align-items: flex-start; }
      .overview-features { grid-template-columns: 1fr; }
    }
  `],
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portal = inject(PortalDataService);
  private toast = inject(ToastService);

  course = signal<any>(null);
  activeTab = signal<'curriculum' | 'overview' | 'instructors' | 'reviews'>('curriculum');
  allExpanded = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || 'angular-for-beginners';
      this.portal.getCourse(slug).subscribe((data) => {
        this.course.set(data);
      });
    });
  }

  setTab(tab: 'curriculum' | 'overview' | 'instructors' | 'reviews') {
    this.activeTab.set(tab);
  }

  toggleModule(mod: any) {
    mod.isExpanded = !mod.isExpanded;
  }

  toggleAllModules() {
    const next = !this.allExpanded();
    this.allExpanded.set(next);
    const c = this.course();
    if (c?.modules) {
      c.modules.forEach((m: any) => (m.isExpanded = next));
    }
  }

  selectLesson(lesson: any) {
    this.toast.show(`Opened lesson: ${lesson.title}`, 'info');
  }

  toggleComplete(lesson: any, event: Event) {
    event.stopPropagation();
    lesson.completed = !lesson.completed;
    this.toast.show(
      lesson.completed ? `Completed: ${lesson.title}` : `Marked incomplete: ${lesson.title}`,
      lesson.completed ? 'success' : 'info',
    );
  }

  onContinue() {
    this.toast.show('Resuming from Module 3: Components and Data Binding', 'info');
  }
}
