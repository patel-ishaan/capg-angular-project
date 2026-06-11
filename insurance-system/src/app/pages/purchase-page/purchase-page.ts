import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar';
import { LoginService } from '../../services/auth/login-service';
import { Policy } from '../../models/policy.model';
import { Purchase } from '../../models/purchase.model';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-purchase-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent, AsyncPipe, DecimalPipe],
  templateUrl: './purchase-page.html',
  styleUrl: './purchase-page.css'
})
export class PurchasePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  // private loginService = inject(LoginService);
  protected loginService = inject(LoginService);

  private BASE_URL = 'http://localhost:3000';

  policy = signal<Policy | null>(null);
  currentStep = signal(1);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');

  // Step 1 — Nominee Form
  nomineeForm = this.fb.group({
    nominees: this.fb.array([this.createNomineeGroup()])
  });

  // Step 2 — Declaration
  declarationAccepted = signal(false);

  // Step 3 — Payment
  paymentForm = this.fb.group({
    paymentMethod: ['', Validators.required]
  });

  get nominees() {
    return this.nomineeForm.get('nominees') as FormArray;
  }

  get totalPercentage() {
    return this.nominees.controls.reduce((sum, c) => sum + (c.get('percentage')?.value || 0), 0);
  }

  createNomineeGroup() {
    return this.fb.group({
      fullName:     ['', Validators.required],
      relationship: ['', Validators.required],
      percentage:   [100, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  addNominee() {
    if (this.nominees.length >= 3) return;
    this.nominees.push(this.createNomineeGroup());
    // redistribute percentages equally
    const equal = Math.floor(100 / this.nominees.length);
    this.nominees.controls.forEach(c => c.get('percentage')?.setValue(equal));
  }

  removeNominee(index: number) {
    if (this.nominees.length === 1) return;
    this.nominees.removeAt(index);
  }

  ngOnInit() {
    const policyId = this.route.snapshot.paramMap.get('policyId');
    if (!policyId) { this.router.navigate(['/catalog']); return; }

    this.http.get<Policy>(`${this.BASE_URL}/policies/${policyId}`).subscribe({
      next: (policy) => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Policy not found.');
        this.loading.set(false);
      }
    });
  }

  nextStep() {
    if (this.currentStep() === 1) {
      if (this.nomineeForm.invalid) { this.nomineeForm.markAllAsTouched(); return; }
      if (this.totalPercentage !== 100) { this.error.set('Nominee percentages must add up to 100%'); return; }
      this.error.set('');
    }
    if (this.currentStep() === 2) {
      if (!this.declarationAccepted()) { this.error.set('Please accept the declaration to continue'); return; }
      this.error.set('');
    }
    this.currentStep.update(s => s + 1);
  }

  prevStep() {
    this.currentStep.update(s => s - 1);
    this.error.set('');
  }

  confirmPurchase() {
    if (this.paymentForm.invalid) { this.paymentForm.markAllAsTouched(); return; }
    const user = this.loginService.currentUser();
    const policy = this.policy();
    if (!user || !policy) return;

    this.submitting.set(true);

    const today = new Date();
    const endDate = new Date();
    endDate.setFullYear(today.getFullYear() + policy.termYears);

    const nominees = this.nominees.value.map((n: any, i: number) => ({
      nomineeId: `nom_${Date.now()}_${i}`,
      percentage: n.percentage
    }));

    const newPurchase: Omit<Purchase, 'id'> = {
      policyId: policy.id,
      customerId: user.id,
      purchaseDate: today,
      startDate: today,
      endDate: endDate,
      selectedNominees: nominees,
      status: 'active',
      policyDocumentUrl: `/docs/${policy.id}-policy.pdf`
    };

    // POST purchase then POST payment
    this.http.post<Purchase>(`${this.BASE_URL}/purchases`, newPurchase).pipe(
      switchMap(purchase => {
        const payment: Omit<Payment, 'id'> = {
          purchaseId: purchase.id,
          customerId: user.id,
          amount: policy.premiumAmount,
          dueDate: endDate.toISOString().split('T')[0],
          paidDate: today.toISOString().split('T')[0],
          status: 'paid',
          paymentMethod: this.paymentForm.value.paymentMethod!
        };
        return this.http.post<Payment>(`${this.BASE_URL}/payments`, payment);
      })
    ).subscribe({
      next: () => {
        this.submitting.set(false);
        this.currentStep.set(4); // success step
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Purchase failed. Please try again.');
      }
    });
  }
}