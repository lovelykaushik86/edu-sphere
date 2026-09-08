import { Component, input } from '@angular/core';
@Component({ selector: 'edu-avatar', template: '<span class="avatar">{{initials()}}</span>', styles: ['.avatar{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#dbeafe;color:#075acb;font-weight:700;font-size:11px}'] })
export class EduAvatarComponent { initials = input('ES'); }
