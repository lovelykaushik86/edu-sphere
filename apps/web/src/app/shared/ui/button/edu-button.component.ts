import { Component, input } from '@angular/core';
@Component({ selector: 'edu-button', template: '<button [type]="type()" [disabled]="disabled()"><ng-content /></button>' })
export class EduButtonComponent { type = input<'button' | 'submit'>('button'); disabled = input(false); }
