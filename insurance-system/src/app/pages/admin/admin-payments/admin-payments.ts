import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment/payment-service';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-payments.html',
  styleUrls: ['./admin-payments.css']
})
export class AdminPaymentsComponent implements OnInit {
  payments: Payment[] = [];
  isLoading = true;
  errorMessage = '';

  private paymentService = inject(PaymentService);

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payments.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}