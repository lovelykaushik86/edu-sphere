import { Component, input } from '@angular/core';
@Component({ selector: 'edu-input', template: '<label>{{label()}}<input [type]="type()" [placeholder]="placeholder()"></label>', styles: ['label{display:grid;gap:5px;color:#526481;font-size:10px}input{height:40px;border:1px solid #dce5f1;border-radius:5px;padding:0 13px}'] })
export class EduInputComponent { label = input(''); type = input('text'); placeholder = input(''); }
