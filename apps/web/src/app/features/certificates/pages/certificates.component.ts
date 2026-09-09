import { Component, OnInit, inject, signal } from '@angular/core';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService, CertificateItem } from '../../../core/api/portal-data.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-certificates',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="My Certificates" [breadcrumbs]="['Home', 'Certificates']">
      <div class="cert-header">
        <h1>My Certificates</h1>
        <p>View and download your verified course certificates</p>
      </div>

      <div class="cert-list">
        @for (cert of certificates(); track cert.id) {
          <div class="cert-card">
            <div class="cert-thumb">
              <div class="cert-thumb-inner">
                <div class="cert-crest">🎓</div>
                <div class="cert-mock-lines">
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
            <div class="cert-info">
              <h3>{{ cert.title }}</h3>
              <p>Completed on {{ cert.issuedAt }}</p>
              <small class="cert-num">Credential ID: {{ cert.certificateNumber }}</small>
            </div>
            <div class="cert-action">
              <button class="download-btn" (click)="download(cert)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        }
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .cert-header {
      margin-bottom: 24px;
    }
    .cert-header h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    .cert-header p {
      font-size: 12px;
      color: #64748b;
      margin: 4px 0 0;
    }

    .cert-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cert-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      transition: all 0.2s ease;
    }
    .cert-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
    }

    .cert-thumb {
      width: 100px;
      height: 68px;
      background: #fdfaf3;
      border: 2px solid #ecd9b5;
      border-radius: 4px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }
    .cert-thumb-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .cert-crest {
      font-size: 20px;
    }
    .cert-mock-lines {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 50px;
    }
    .cert-mock-lines span {
      display: block;
      height: 2px;
      background: #d4b886;
      border-radius: 2px;
    }

    .cert-info {
      flex: 1;
    }
    .cert-info h3 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px;
    }
    .cert-info p {
      font-size: 11.5px;
      color: #64748b;
      margin: 0 0 4px;
    }
    .cert-num {
      font-size: 10px;
      color: #94a3b8;
    }

    .download-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 16px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      color: #1868db;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .download-btn:hover {
      background: #eff6ff;
      border-color: #1868db;
    }

    @media (max-width: 640px) {
      .cert-card { flex-direction: column; align-items: flex-start; }
      .download-btn { width: 100%; justify-content: center; }
    }
  `],
})
export class CertificatesComponent implements OnInit {
  private portal = inject(PortalDataService);
  private toast = inject(ToastService);

  certificates = signal<CertificateItem[]>([]);

  ngOnInit() {
    this.portal.getCertificates().subscribe((data) => {
      this.certificates.set(data);
    });
  }

  download(cert: CertificateItem) {
    this.toast.show(`Downloading PDF for ${cert.title}…`, 'success');
  }
}
