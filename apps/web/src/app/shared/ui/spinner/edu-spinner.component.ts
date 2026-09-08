import { Component } from '@angular/core';
@Component({ selector: 'edu-spinner', template: '<span class="spinner" aria-label="Loading"></span>', styles: ['.spinner{display:inline-block;width:18px;height:18px;border:2px solid #dbe9ff;border-top-color:#1568ee;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}'] })
export class EduSpinnerComponent {}
