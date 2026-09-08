import { Component, input } from '@angular/core';
@Component({ selector: 'edu-breadcrumb', template: '<nav aria-label="Breadcrumb">{{items().join(" / ")}}</nav>', styles: ['nav{font-size:11px;color:#71809a}'] })
export class EduBreadcrumbComponent { items = input<string[]>([]); }
