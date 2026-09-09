import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'edu-toast',
  standalone: true,
  template: `
    @if (toast.current(); as item) {
      <div class="toast-container" [class]="item.tone">
        <div class="toast-content">
          @if (item.tone === 'success') {
            <span class="icon">✓</span>
          } @else if (item.tone === 'error') {
            <span class="icon">✕</span>
          } @else {
            <span class="icon">ℹ</span>
          }
          <span class="message">{{ item.message }}</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      min-width: 280px;
      max-width: 420px;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.25s ease-out;
      font-size: 13px;
      font-weight: 500;
      color: white;
    }
    .toast-container.success {
      background: #059669;
    }
    .toast-container.error {
      background: #dc2626;
    }
    .toast-container.info {
      background: #1868db;
    }
    .toast-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .icon {
      font-weight: 700;
      font-size: 14px;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class ToastComponent {
  toast = inject(ToastService);
}
