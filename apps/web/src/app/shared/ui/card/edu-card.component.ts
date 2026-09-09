import { Component, input } from '@angular/core';

@Component({
  selector: 'edu-card',
  standalone: true,
  template: `
    <section class="edu-card" [class.hoverable]="hoverable()" [class.bordered]="bordered()">
      <ng-content />
    </section>
  `,
  styles: [`
    .edu-card {
      background: #ffffff;
      border: 1px solid #edf2f7;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      padding: 20px;
      transition: all 0.2s ease-in-out;
    }
    .edu-card.bordered {
      border: 1px solid #e2e8f0;
    }
    .edu-card.hoverable:hover {
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      transform: translateY(-2px);
    }
  `],
})
export class EduCardComponent {
  hoverable = input(false);
  bordered = input(true);
}
