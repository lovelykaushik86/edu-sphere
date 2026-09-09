import { Component, input } from '@angular/core';

@Component({
  selector: 'edu-brand',
  standalone: true,
  template: `
    <div class="edu-brand-container" [class.compact]="compact()">
      <div class="edu-brand-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <div class="edu-brand-text">
        <span class="edu-brand-title">EduSphere</span>
        @if (!hideTagline()) {
          <span class="edu-brand-tagline">Learn · Grow · Succeed</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .edu-brand-container {
      display: flex;
      align-items: center;
      gap: 9px;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      user-select: none;
    }
    .edu-brand-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1868db, #0b49a5);
      color: white;
      display: grid;
      place-items: center;
      box-shadow: 0 4px 10px rgba(24, 104, 219, 0.28);
      flex-shrink: 0;
    }
    .edu-brand-text {
      display: flex;
      flex-direction: column;
    }
    .edu-brand-title {
      font-size: 19px;
      font-weight: 800;
      color: #0b1f44;
      line-height: 1.1;
      letter-spacing: -0.4px;
    }
    .edu-brand-tagline {
      font-size: 8.5px;
      font-weight: 500;
      color: #64748b;
      letter-spacing: 0.3px;
      margin-top: 1px;
    }
    .compact .edu-brand-icon {
      width: 28px;
      height: 28px;
    }
    .compact .edu-brand-title {
      font-size: 16px;
    }
  `],
})
export class BrandComponent {
  compact = input(false);
  hideTagline = input(false);
}
