import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { NavbarComponent } from '../../../components/navbar/navbar';
import { LoginService } from '../../../services/auth/login-service';
import { ClaimService } from '../../../services/claim/claim.service';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../../../models/purchase.model';
import { Policy } from '../../../models/policy.model';

// --- document config ---
const DOCUMENT_REQUIREMENTS: Record<string, string[]> = {
  health:  ['hospital_bill', 'discharge_summary', 'prescription'],
  vehicle: ['fir_copy', 'repair_estimate', 'driving_license'],
  life:    ['death_certificate', 'fir_copy', 'medical_report']
};

// --- custom validators ---
function claimAmountValidator(maxAmount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return +control.value > maxAmount
      ? { exceedsCoverage: { max: maxAmount, actual: control.value } }
      : null;
  };
}

function incidentDateValidator(startDate: string, endDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const incident = new Date(control.value);
    if (incident < new Date(startDate)) return { beforePolicyStart: true };
    if (incident > new Date(endDate))   return { afterPolicyEnd: true };
    return null;
  };
}

function atLeastOneDocValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const anyChecked = Object.values(group.controls).some(c => c.value === true);
  return anyChecked ? null : { noDocuments: true };
}

// --- interfaces ---
interface PurchaseWithPolicy extends Purchase {
  policy?: Policy;
}

@Component({
  selector: 'app-add-claim',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, RouterLink, DecimalPipe],
  templateUrl: './add-claim.html',
  styleUrl: './add-claim.css'
})
export class AddClaimComponent implements OnInit {
  private fb           = inject(FormBuilder);
  private http         = inject(HttpClient);
  private loginService = inject(LoginService);
  private claimService = inject(ClaimService);
  private router       = inject(Router);

  // state
  activePurchases  = signal<PurchaseWithPolicy[]>([]);
  selectedPurchase = signal<PurchaseWithPolicy | null>(null);
  requiredDocs     = signal<string[]>([]);
  loading          = signal(false);
  submitting       = signal(false);
  error            = signal('');
  success          = signal('');

  // main form
  form = this.fb.group({
    purchaseId:   ['', Validators.required],
    incidentDate: ['', Validators.required],
    claimAmount:  [null as number | null, [Validators.required, Validators.min(1)]],
    description:  ['', [Validators.required, Validators.minLength(20)]],
    documents:    this.fb.group({})
  });

  // convenience getters
  get purchaseId()     { return this.form.get('purchaseId')!; }
  get incidentDate()   { return this.form.get('incidentDate')!; }
  get claimAmount()    { return this.form.get('claimAmount')!; }
  get description()    { return this.form.get('description')!; }
  get documentsGroup() { return this.form.get('documents') as FormGroup; }

  ngOnInit() {
    const userId = this.loginService.currentUser()?.id;
    if (!userId) return;

    this.loading.set(true);

    this.http.get<Purchase[]>(
      `http://localhost:3000/purchases?customerId=${userId}&status=active`
    ).subscribe({
      next: purchases => {
        this.http.get<Policy[]>('http://localhost:3000/policies').subscribe({
          next: policies => {
            const enriched = purchases.map(p => ({
              ...p,
              policy: policies.find(pol => pol.id === p.policyId)
            }));
            this.activePurchases.set(enriched);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Could not load your policies. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onPolicyChange(event: Event) {
    const purchaseId = (event.target as HTMLSelectElement).value;
    const purchase = this.activePurchases().find(p => p.id === purchaseId) ?? null;
    this.selectedPurchase.set(purchase);

    if (!purchase?.policy) return;

    // update claimAmount validator with coverage ceiling
    this.claimAmount.setValidators([
      Validators.required,
      Validators.min(1),
      claimAmountValidator(purchase.policy.coverageAmount)
    ]);
    this.claimAmount.updateValueAndValidity();

    // update incidentDate validator with policy period
    this.incidentDate.setValidators([
      Validators.required,
      incidentDateValidator(
        purchase.startDate as unknown as string,
        purchase.endDate   as unknown as string
      )
    ]);
    this.incidentDate.updateValueAndValidity();

    // rebuild documents group dynamically
    this.buildDocumentControls(purchase.policy.type);
  }

  private buildDocumentControls(policyType: string) {
    const docs = DOCUMENT_REQUIREMENTS[policyType] ?? [];
    this.requiredDocs.set(docs);

    const group = this.documentsGroup;
    Object.keys(group.controls).forEach(key => group.removeControl(key));
    docs.forEach(doc => group.addControl(doc, this.fb.control(false)));

    group.setValidators(atLeastOneDocValidator);
    group.updateValueAndValidity();
  }

  formatDocLabel(key: string): string {
    return key.split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const purchase = this.selectedPurchase();
    if (!purchase) return;

    this.submitting.set(true);
    this.error.set('');

    const docValues: Record<string, boolean> = this.documentsGroup.value;
    const documents = Object.entries(docValues)
      .filter(([, checked]) => checked)
      .map(([type]) => ({ type, url: '', verified: false }));

    const now = new Date();
    const purchaseId = this.form.value.purchaseId ?? '';
    const incidentDateValue = new Date(this.form.value.incidentDate ?? '');
    const claimAmountValue = this.form.value.claimAmount ?? 0;
    const descriptionValue = this.form.value.description ?? '';

    const newClaim = {
      purchaseId,
      incidentDate: incidentDateValue,
      claimAmount:  claimAmountValue,
      description:  descriptionValue,
      documents,
      status:       'submitted' as const,
      adminRemarks: '',
      submittedAt:  now,
      updatedAt:    now
    };

    this.claimService.submitClaim(newClaim).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set('Claim submitted successfully! Redirecting...');
        setTimeout(() => this.router.navigate(['/claims']), 2000);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Submission failed. Please try again.');
      }
    });
  }
}