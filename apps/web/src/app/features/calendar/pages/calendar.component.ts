import { Component, inject, signal } from '@angular/core';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { ToastService } from '../../../shared/ui/toast/toast.service';

interface CalDay {
  dayNum: number;
  isCurrentMonth: boolean;
  events: Array<{ title: string; type: string }>;
}

@Component({
  selector: 'edu-calendar',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Calendar" [breadcrumbs]="['Home', 'Calendar']">
      <div class="calendar-card">
        <!-- Header -->
        <div class="calendar-top">
          <div class="month-controls">
            <button class="nav-arrow" (click)="prevMonth()">‹</button>
            <button class="nav-arrow" (click)="nextMonth()">›</button>
            <h2>April 2025</h2>
          </div>
          <button class="today-btn" (click)="today()">Today</button>
        </div>

        <!-- Days of Week Header -->
        <div class="weekdays-grid">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <!-- Month Grid -->
        <div class="month-grid">
          @for (cell of days(); track cell.dayNum) {
            <div class="calendar-cell" [class.other-month]="!cell.isCurrentMonth">
              <span class="day-number">{{ cell.dayNum }}</span>
              <div class="events-container">
                @for (ev of cell.events; track ev.title) {
                  <div
                    class="event-pill"
                    [class]="ev.type.toLowerCase()"
                    (click)="openEvent(ev, cell.dayNum)"
                  >
                    {{ ev.title }}
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .calendar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .calendar-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .month-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-arrow {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      font-size: 16px;
      display: grid;
      place-items: center;
      cursor: pointer;
      color: #475569;
    }
    .month-controls h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .today-btn {
      height: 30px;
      padding: 0 14px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }

    .weekdays-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .month-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(85px, 1fr);
      border-left: 1px solid #f1f5f9;
      border-top: 1px solid #f1f5f9;
    }
    .calendar-cell {
      border-right: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      min-height: 80px;
    }
    .calendar-cell.other-month {
      background: #f8fafc;
      opacity: 0.5;
    }
    .day-number {
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 4px;
    }
    .events-container {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .event-pill {
      font-size: 9.5px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-pill.assignment {
      background: #eff6ff;
      color: #1868db;
      border-left: 2px solid #1868db;
    }
    .event-pill.live_class {
      background: #ecfeff;
      color: #0891b2;
      border-left: 2px solid #0891b2;
    }
    .event-pill.quiz {
      background: #fffbeb;
      color: #d97706;
      border-left: 2px solid #d97706;
    }
    .event-pill.project_due {
      background: #fef2f2;
      color: #dc2626;
      border-left: 2px solid #dc2626;
    }
  `],
})
export class CalendarComponent {
  private toast = inject(ToastService);

  days = signal<CalDay[]>([
    { dayNum: 30, isCurrentMonth: false, events: [] },
    { dayNum: 31, isCurrentMonth: false, events: [] },
    { dayNum: 1, isCurrentMonth: true, events: [] },
    { dayNum: 2, isCurrentMonth: true, events: [] },
    { dayNum: 3, isCurrentMonth: true, events: [] },
    { dayNum: 4, isCurrentMonth: true, events: [] },
    { dayNum: 5, isCurrentMonth: true, events: [] },
    { dayNum: 6, isCurrentMonth: true, events: [] },
    { dayNum: 7, isCurrentMonth: true, events: [] },
    { dayNum: 8, isCurrentMonth: true, events: [] },
    { dayNum: 9, isCurrentMonth: true, events: [] },
    { dayNum: 10, isCurrentMonth: true, events: [{ title: 'Assignment 3', type: 'assignment' }] },
    { dayNum: 11, isCurrentMonth: true, events: [] },
    { dayNum: 12, isCurrentMonth: true, events: [] },
    { dayNum: 13, isCurrentMonth: true, events: [] },
    { dayNum: 14, isCurrentMonth: true, events: [] },
    { dayNum: 15, isCurrentMonth: true, events: [{ title: 'Final Project', type: 'project_due' }] },
    { dayNum: 16, isCurrentMonth: true, events: [{ title: 'Live Class', type: 'live_class' }] },
    { dayNum: 17, isCurrentMonth: true, events: [] },
    { dayNum: 18, isCurrentMonth: true, events: [{ title: 'Quiz 2', type: 'quiz' }] },
    { dayNum: 19, isCurrentMonth: true, events: [] },
    { dayNum: 20, isCurrentMonth: true, events: [] },
    { dayNum: 21, isCurrentMonth: true, events: [] },
    { dayNum: 22, isCurrentMonth: true, events: [] },
    { dayNum: 23, isCurrentMonth: true, events: [] },
    { dayNum: 24, isCurrentMonth: true, events: [{ title: 'Project Due', type: 'project_due' }] },
    { dayNum: 25, isCurrentMonth: true, events: [] },
    { dayNum: 26, isCurrentMonth: true, events: [] },
    { dayNum: 27, isCurrentMonth: true, events: [] },
    { dayNum: 28, isCurrentMonth: true, events: [] },
    { dayNum: 29, isCurrentMonth: true, events: [] },
    { dayNum: 30, isCurrentMonth: true, events: [] },
    { dayNum: 1, isCurrentMonth: false, events: [] },
    { dayNum: 2, isCurrentMonth: false, events: [] },
    { dayNum: 3, isCurrentMonth: false, events: [] },
  ]);

  prevMonth() {
    this.toast.show('Browsing March 2025', 'info');
  }

  nextMonth() {
    this.toast.show('Browsing May 2025', 'info');
  }

  today() {
    this.toast.show('Showing April 2025', 'info');
  }

  openEvent(ev: any, day: number) {
    this.toast.show(`Event: ${ev.title} on Apr ${day}, 2025`, 'info');
  }
}
