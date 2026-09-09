import { Component, input } from '@angular/core';

@Component({
  selector: 'edu-avatar',
  standalone: true,
  template: `
    <div class="avatar-wrap" [class]="size()">
      @if (src()) {
        <img [src]="src()" [alt]="initials()" class="avatar-img" />
      } @else {
        <span class="avatar-initials">{{ initials() }}</span>
      }
      @if (online()) {
        <span class="online-indicator"></span>
      }
    </div>
  `,
  styles: [`
    .avatar-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
      user-select: none;
    }
    .avatar-wrap.sm { width: 28px; height: 28px; font-size: 10px; }
    .avatar-wrap.md { width: 36px; height: 36px; font-size: 12px; }
    .avatar-wrap.lg { width: 68px; height: 68px; font-size: 22px; }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
    .avatar-initials {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e0edff;
      color: #1868db;
      font-weight: 700;
    }
    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 9px;
      height: 9px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }
  `],
})
export class EduAvatarComponent {
  initials = input('AJ');
  src = input<string | undefined>(undefined);
  size = input<'sm' | 'md' | 'lg'>('md');
  online = input(false);
}
