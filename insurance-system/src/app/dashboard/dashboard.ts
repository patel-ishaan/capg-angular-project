import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// import { LoginService } from '../../services/auth/login-service.ts';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../components/navbar/navbar';
import { LoginService } from '../services/auth/login-service';
import { Purchase } from '../models/purchase.model';
import { Policy } from '../models/policy.model';
import { DecimalPipe } from '@angular/common';
import { PolicyReportsService } from '../services/reports/policy-reports.service';

interface PurchaseWithPolicy extends Purchase {
  policy?: Policy;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NavbarComponent, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private reportService = inject(PolicyReportsService);

  currentUser = this.loginService.currentUser;
  purchases = signal<PurchaseWithPolicy[]>([]);
  loading = signal(true);

  ngOnInit() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.http
      .get<Purchase[]>(`http://localhost:3000/purchases?customerId=${userId}`)
      .subscribe((purchases) => {
        if (purchases.length === 0) {
          this.loading.set(false);
          return;
        }

        this.http.get<Policy[]>('http://localhost:3000/policies').subscribe((policies) => {
          const enriched = purchases.map((p) => ({
            ...p,
            policy: policies.find((pol) => pol.id === p.policyId),
          }));
          this.purchases.set(enriched);
          this.loading.set(false);
        });
      });
  }

  downloadPolicyReport(policyId: string): void {
    this.reportService.generatePolicyPdf(policyId).subscribe({
      error: (err) => console.error('Failed to generate report', err),
    });
  }
}
