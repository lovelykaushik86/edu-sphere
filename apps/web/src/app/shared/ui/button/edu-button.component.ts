import { Component, input } from '@angular/core';

@Component({
  selector: 'edu-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      class="edu-btn"
      [class]="variant()"
      [class.full-width]="fullWidth()"
      [class.loading]="loading()"
    >
      @if (loading()) {
        <span class="btn-spinner"></span>
      }
      <span class="btn-content" [style.visibility]="loading() ? 'hidden' : 'visible'">
        <ng-content />
      </span>
    </button>
  `,
  styles: [`
    .edu-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      height: 38px;
      padding: 0 16px;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      position: relative;
      white-space: nowrap;
    }
    .edu-btn.full-width {
      width: 100%;
    }
    .edu-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    .edu-btn.primary {
      background: #1868db;
      color: white;
      border-color: #155cc4;
      box-shadow: 0 2px 6px rgba(24, 104, 219, 0.25);
    }
    .edu-btn.primary:hover:not(:disabled) {
      background: #135ac0;
      box-shadow: 0 4px 10px rgba(24, 104, 219, 0.35);
    }
    .edu-btn.secondary {
      background: #f1f5f9;
      color: #334155;
      border-color: #e2e8f0;
    }
    .edu-btn.secondary:hover:not(:disabled) {
      background: #e2e8f0;
    }
    .edu-btn.outline {
      background: transparent;
      color: #1868db;
      border-color: #cbd5e1;
    }
    .edu-btn.outline:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #1868db;
    }
    .edu-btn.social {
      background: white;
      color: #1e293b;
      border-color: #e2e8f0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .edu-btn.social:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .btn-spinner {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class EduButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'outline' | 'social'>('primary');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);
}
