import { Component, OnInit, inject, signal } from '@angular/core';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService } from '../../../core/api/portal-data.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-organization',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Organization" [breadcrumbs]="['Home', 'Organizations']">
      <div class="org-header">
        <div>
          <h1>{{ org()?.name || 'EduSphere Global Academy' }}</h1>
          <p>{{ org()?.domain }} · {{ org()?.address }} · {{ org()?.country }}</p>
        </div>
        <div class="sub-pill">
          <span class="sub-tag">PRO PLAN</span>
          <span class="sub-status">Active</span>
        </div>
      </div>

      <!-- Overview Stats -->
      <section class="org-stats">
        <div class="stat-box">
          <span class="num">3</span>
          <span class="lbl">Active Campuses</span>
        </div>
        <div class="stat-box">
          <span class="num">142</span>
          <span class="lbl">Members Enrolled</span>
        </div>
        <div class="stat-box">
          <span class="num">24</span>
          <span class="lbl">Active Courses</span>
        </div>
        <div class="stat-box">
          <span class="num">1,000</span>
          <span class="lbl">User Quota</span>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="org-tabs">
        <button [class.active]="tab() === 'branches'" (click)="tab.set('branches')">Campuses / Branches</button>
        <button [class.active]="tab() === 'members'" (click)="tab.set('members')">Team & Members</button>
        <button [class.active]="tab() === 'rbac'" (click)="tab.set('rbac')">Roles & Permissions (RBAC)</button>
      </nav>

      @if (tab() === 'branches') {
        <div class="branches-grid">
          @for (b of org()?.branches; track b.id) {
            <div class="branch-card">
              <div class="branch-top">
                <span class="branch-code">{{ b.code }}</span>
                <span class="city-tag">{{ b.city }}</span>
              </div>
              <h3>{{ b.name }}</h3>
              <p>{{ b.city }}, {{ b.country }}</p>
              <div class="branch-footer">
                <span class="status-indicator">● Operational</span>
                <button class="branch-action-btn" (click)="manageBranch(b)">Manage →</button>
              </div>
            </div>
          }
        </div>
      } @else if (tab() === 'members') {
        <div class="members-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Assigned Campus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (m of org()?.members; track m.id) {
                <tr>
                  <td>
                    <b>{{ m.user?.fullName }}</b>
                    <small>{{ m.user?.email }}</small>
                  </td>
                  <td>
                    <span class="role-pill" [class]="m.role.toLowerCase()">{{ m.role }}</span>
                  </td>
                  <td>{{ m.branch?.name || 'All Campuses' }}</td>
                  <td><span class="badge-active">Active</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="rbac-card">
          <h3>RBAC Permission Matrix</h3>
          <p>Granular access control defined for Sprint 2 role enforcement:</p>
          <div class="matrix-grid">
            <div class="matrix-row header">
              <span>Permission</span>
              <span>SUPER_ADMIN</span>
              <span>ADMIN</span>
              <span>TRAINER</span>
              <span>STUDENT</span>
            </div>
            <div class="matrix-row">
              <span>org:read / org:update</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="cross">-</span>
              <span class="cross">-</span>
            </div>
            <div class="matrix-row">
              <span>course:create / course:publish</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="cross">-</span>
            </div>
            <div class="matrix-row">
              <span>student:enroll / student:progress</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
            </div>
            <div class="matrix-row">
              <span>assessment:grade</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="check">✓</span>
              <span class="cross">-</span>
            </div>
          </div>
        </div>
      }
    </edu-main-layout>
  `,
  styles: [`
    .org-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 16px;
    }
    .org-header h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .org-header p {
      color: #64748b;
      font-size: 12px;
      margin: 0;
    }
    .sub-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 6px 14px;
      border-radius: 999px;
    }
    .sub-tag {
      font-size: 11px;
      font-weight: 800;
      color: #1868db;
    }
    .sub-status {
      font-size: 10px;
      color: #059669;
      font-weight: 700;
    }

    .org-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .stat-box .num {
      display: block;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }
    .stat-box .lbl {
      display: block;
      font-size: 11px;
      color: #64748b;
      margin-top: 3px;
    }

    .org-tabs {
      display: flex;
      gap: 20px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .org-tabs button {
      background: none;
      border: none;
      padding: 10px 0;
      font-size: 12.5px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      position: relative;
    }
    .org-tabs button.active {
      color: #1868db;
    }
    .org-tabs button.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1868db;
    }

    .branches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .branch-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .branch-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .branch-code {
      font-size: 10px;
      font-weight: 700;
      background: #eff6ff;
      color: #1868db;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .city-tag {
      font-size: 10px;
      color: #64748b;
    }
    .branch-card h3 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px;
    }
    .branch-card p {
      font-size: 11px;
      color: #64748b;
      margin: 0 0 14px;
    }
    .branch-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }
    .status-indicator {
      font-size: 10.5px;
      color: #16a34a;
      font-weight: 600;
    }
    .branch-action-btn {
      background: none;
      border: none;
      color: #1868db;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .members-card, .rbac-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .data-table th {
      text-align: left;
      padding: 10px 14px;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
    }
    .data-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #f8fafc;
      color: #1e293b;
    }
    .data-table b {
      display: block;
      color: #0f172a;
    }
    .data-table small {
      color: #64748b;
      font-size: 10.5px;
    }
    .role-pill {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .role-pill.admin { background: #fee2e2; color: #dc2626; }
    .role-pill.trainer { background: #ecfeff; color: #0891b2; }
    .role-pill.student { background: #eff6ff; color: #1868db; }
    .badge-active {
      font-size: 10px;
      color: #16a34a;
      background: #f0fdf4;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .matrix-grid {
      display: grid;
      gap: 8px;
      margin-top: 16px;
      font-size: 12px;
    }
    .matrix-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 6px;
      align-items: center;
    }
    .matrix-row.header {
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
    }
    .matrix-row .check { color: #16a34a; font-weight: 700; }
    .matrix-row .cross { color: #94a3b8; }
  `],
})
export class OrganizationComponent implements OnInit {
  private portal = inject(PortalDataService);
  private toast = inject(ToastService);

  org = signal<any>(null);
  tab = signal<'branches' | 'members' | 'rbac'>('branches');

  ngOnInit() {
    this.portal.getOrganization('edusphere-global').subscribe((data) => {
      this.org.set(data);
    });
  }

  manageBranch(b: any) {
    this.toast.show(`Managing ${b.name} (${b.code})`, 'info');
  }
}
