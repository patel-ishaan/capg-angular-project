import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BASE_URL = 'http://localhost:3000';
  private http = inject(HttpClient);

  getPaymentsByCustomer(customerId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.BASE_URL}/payments?customerId=${customerId}`);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.BASE_URL}/payments`);
  }
}