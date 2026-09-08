import { Injectable, signal } from '@angular/core';
export interface Toast { message: string; tone: 'success' | 'error' | 'info'; }
@Injectable({ providedIn: 'root' }) export class ToastService { current = signal<Toast | null>(null); show(message: string, tone: Toast['tone'] = 'info') { this.current.set({ message, tone }); setTimeout(() => this.current.set(null), 4000); } }
