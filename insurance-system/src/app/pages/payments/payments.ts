import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { LoginService } from '../../services/auth/login-service';
import { PaymentService } from '../../services/payment-service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsPageComponent implements OnInit {
  private loginService = inject(LoginService);
  private paymentService = inject(PaymentService);

  payments = signal<Payment[]>([]);
  loading = signal(true);
  error = signal('');

  totalDue = computed(() => this.payments()
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0));

  totalPaid = computed(() => this.payments()
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0));

  overdueCount = computed(() => this.payments().filter(payment => payment.status === 'overdue').length);
  dueCount = computed(() => this.payments().filter(payment => payment.status === 'due').length);

  ngOnInit() {
    const userId = this.loginService.currentUser()?.id;
    if (!userId) {
      this.error.set('You must be logged in to view payments.');
      this.loading.set(false);
      return;
    }

    this.paymentService.getPaymentsByCustomer(userId).subscribe({
      next: (payments: Payment[]) => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load payments. Please try again later.');
        this.loading.set(false);
      }
    });
  }
}
