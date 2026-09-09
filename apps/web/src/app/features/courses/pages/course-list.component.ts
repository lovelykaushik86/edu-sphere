import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService } from '../../../core/api/portal-data.service';

@Component({
  selector: 'edu-course-list',
  standalone: true,
  imports: [RouterLink, MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Course Catalog" [breadcrumbs]="['Home', 'Courses']">
      <div class="courses-header">
        <div>
          <h1>Explore Courses</h1>
          <p>Advance your career with industry-tailored curriculum and practical projects.</p>
        </div>
        <div class="filters">
          <button [class.active]="selectedLevel() === 'ALL'" (click)="setLevel('ALL')">All Levels</button>
          <button [class.active]="selectedLevel() === 'BEGINNER'" (click)="setLevel('BEGINNER')">Beginner</button>
          <button [class.active]="selectedLevel() === 'INTERMEDIATE'" (click)="setLevel('INTERMEDIATE')">Intermediate</button>
        </div>
      </div>

      <div class="courses-grid">
        @for (course of filteredCourses(); track course.id) {
          <div class="course-card">
            <div class="card-hero" [class]="course.colorScheme">
              <span class="hero-icon">{{ course.iconText }}</span>
              <span class="card-badge">{{ course.badge }}</span>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span>⏱ {{ course.durationHours }} hours</span>
                <span class="rating">★ {{ course.rating }} ({{ course.reviewsCount }})</span>
              </div>
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="card-footer">
                <span class="level-tag">{{ course.level }}</span>
                <a [routerLink]="['/courses', course.slug]" class="view-btn">View Course →</a>
              </div>
            </div>
          </div>
        }
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .courses-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
      gap: 16px;
    }
    .courses-header h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .courses-header p {
      color: #64748b;
      font-size: 12px;
      margin: 0;
    }
    .filters {
      display: flex;
      gap: 8px;
    }
    .filters button {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }
    .filters button.active {
      background: #1868db;
      color: white;
      border-color: #1868db;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .course-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      transition: all 0.2s ease;
    }
    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }
    .card-hero {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: white;
    }
    .card-hero.red { background: linear-gradient(135deg, #e11d48, #be123c); }
    .card-hero.navy { background: linear-gradient(135deg, #0b1f44, #1e3a8a); }
    .card-hero.blue { background: linear-gradient(135deg, #1868db, #60a5fa); }
    .card-hero.gold { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .hero-icon {
      font-size: 44px;
      font-weight: 800;
    }
    .card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.3);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-meta {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .rating { color: #f59e0b; font-weight: 700; }
    .card-body h3 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px;
    }
    .card-body p {
      font-size: 11px;
      color: #64748b;
      margin: 0 0 16px;
      line-height: 1.4;
      flex: 1;
    }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }
    .level-tag {
      font-size: 10px;
      color: #059669;
      font-weight: 700;
      background: #ecfdf5;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .view-btn {
      font-size: 11.5px;
      font-weight: 600;
      color: #1868db;
      text-decoration: none;
    }
    @media (max-width: 640px) {
      .courses-header { flex-direction: column; align-items: stretch; }
    }
  `],
})
export class CourseListComponent implements OnInit {
  private portal = inject(PortalDataService);

  courses = signal<any[]>([]);
  selectedLevel = signal<'ALL' | 'BEGINNER' | 'INTERMEDIATE'>('ALL');

  ngOnInit() {
    this.portal.getCourses().subscribe((list) => {
      this.courses.set(list);
    });
  }

  setLevel(level: 'ALL' | 'BEGINNER' | 'INTERMEDIATE') {
    this.selectedLevel.set(level);
  }

  filteredCourses = () => {
    const lvl = this.selectedLevel();
    if (lvl === 'ALL') return this.courses();
    return this.courses().filter((c) => c.level?.toUpperCase() === lvl);
  };
}
