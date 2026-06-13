import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Added for ngModel
import { NavbarComponent } from '../../components/navbar/navbar';
import { LoginService } from '../../services/auth/login-service';
import { PaymentService } from '../../services/payment/payment-service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsPageComponent implements OnInit {
  private loginService = inject(LoginService);
  private paymentService = inject(PaymentService);

  allPayments: Payment[] = []; // Store original data for resetting filters
  payments = signal<Payment[]>([]); // Displayed data
  loading = signal(true);
  error = signal('');

  // Filter State
  filters = {
    status: '',
    method: '',
    minAmount: null as number | null,
    maxAmount: null as number | null
  };

  // Computeds automatically update when filters change the payments signal
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
        this.allPayments = payments;
        this.payments.set(payments); // Initialize with all
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load payments. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    const filtered = this.allPayments.filter(p => {
      const matchStatus = !this.filters.status || p.status === this.filters.status;
      const matchMethod = !this.filters.method || p.paymentMethod.toLowerCase().includes(this.filters.method.toLowerCase());
      const matchMin = !this.filters.minAmount || p.amount >= this.filters.minAmount;
      const matchMax = !this.filters.maxAmount || p.amount <= this.filters.maxAmount;
      return matchStatus && matchMethod && matchMin && matchMax;
    });
    this.payments.set(filtered);
  }

  resetFilters() {
    this.filters = {
      status: '',
      method: '',
      minAmount: null,
      maxAmount: null
    };
    this.payments.set(this.allPayments);
  }
}