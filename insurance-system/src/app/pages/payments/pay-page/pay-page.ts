import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar';
import { Payment } from '../../../models/payment.model';
import { Purchase } from '../../../models/purchase.model';
import { Policy } from '../../../models/policy.model';
import { LoginService } from '../../../services/auth/login-service';

@Component({
  selector: 'app-pay-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './pay-page.html',
  styleUrl: './pay-page.css'
})
export class PayPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private loginService = inject(LoginService);

  payment = signal<Payment | null>(null);
  purchase = signal<Purchase | null>(null);
  policy = signal<Policy | null>(null);
  loading = signal(true);
  error = signal('');
  
  paymentMethod = 'upi';

  ngOnInit() {
    const userId = this.loginService.currentUser()?.id;
    if (!userId) {
      this.error.set('You must be logged in to access this page.');
      this.loading.set(false);
      return;
    }

    const paymentId = this.route.snapshot.paramMap.get('paymentId');
    if (!paymentId) {
      this.error.set('Invalid payment id.');
      this.loading.set(false);
      return;
    }

    this.http.get<Payment>(`http://localhost:3000/payments/${paymentId}`).subscribe({
      next: payment => {
        this.payment.set(payment);
        this.http.get<Purchase>(`http://localhost:3000/purchases/${payment.purchaseId}`).subscribe({
          next: purchase => {
            this.purchase.set(purchase);
            this.http.get<Policy>(`http://localhost:3000/policies/${purchase.policyId}`).subscribe({
              next: policy => {
                this.policy.set(policy);
                this.loading.set(false);
              },
              error: () => this.loading.set(false)
            });
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => {
        this.error.set('Payment not found.');
        this.loading.set(false);
      }
    });
  }

  confirmPayment() {
    const p = this.payment();
    if (!p) return;
    this.loading.set(true);
    const now = new Date().toISOString();
    
    this.http.patch<Payment>(`http://localhost:3000/payments/${p.id}`, { 
      status: 'paid', 
      paidDate: now,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/payments']);
      },
      error: () => {
        this.error.set('Unable to process payment. Try again later.');
        this.loading.set(false);
      }
    });
  }
}