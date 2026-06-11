import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminPolicyService } from '../../../services/admin/admin-policy.service';
import { Policy } from '../../../models/policy.model';

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-policies.html',
  styleUrl: './admin-policies.css'
})
export class AdminPolicies implements OnInit {
  private adminPolicyService = inject(AdminPolicyService);
  private fb = inject(FormBuilder);

  policies = signal<Policy[]>([]);
  loading = signal(true);
  error = signal('');
  showForm = signal(false);
  editingPolicy = signal<Policy | null>(null);
  submitting = signal(false);

  form = this.fb.group({
    name:           ['', Validators.required],
    type:           ['', Validators.required],
    coverageAmount: [0, [Validators.required, Validators.min(1)]],
    premiumAmount:  [0, [Validators.required, Validators.min(1)]],
    termYears:      [1, [Validators.required, Validators.min(1)]],
    minAge:         [18, [Validators.required, Validators.min(1)]],
    maxAge:         [65, [Validators.required, Validators.min(1)]],
    benefits:       ['', Validators.required],
    exclusions:     ['', Validators.required],
    isActive:       [true]
  });

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading.set(true);
    this.adminPolicyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policies.set(policies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load policies.');
        this.loading.set(false);
      }
    });
  }

  openAddForm() {
    this.editingPolicy.set(null);
    this.form.reset({
      name: '', type: '', coverageAmount: 0,
      premiumAmount: 0, termYears: 1,
      minAge: 18, maxAge: 65,
      benefits: '', exclusions: '', isActive: true
    });
    this.showForm.set(true);
  }

  openEditForm(policy: Policy) {
    this.editingPolicy.set(policy);
    this.form.patchValue({
      name:           policy.name,
      type:           policy.type,
      coverageAmount: policy.coverageAmount,
      premiumAmount:  policy.premiumAmount,
      termYears:      policy.termYears,
      minAge:         policy.minAge,
      maxAge:         policy.maxAge,
      benefits:       policy.benefits.join(', '),
      exclusions:     policy.exclusions.join(', '),
      isActive:       policy.isActive
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingPolicy.set(null);
    this.error.set('');
  }

  submitForm() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);

    const val = this.form.value;
    const payload: Omit<Policy, 'id'> = {
      name:           val.name!,
      type:           val.type as 'health' | 'life' | 'vehicle',
      coverageAmount: Number(val.coverageAmount),
      premiumAmount:  Number(val.premiumAmount),
      termYears:      Number(val.termYears),
      minAge:         Number(val.minAge),
      maxAge:         Number(val.maxAge),
      benefits:       val.benefits!.split(',').map(b => b.trim()).filter(Boolean),
      exclusions:     val.exclusions!.split(',').map(e => e.trim()).filter(Boolean),
      isActive:       val.isActive!
    };

    const editing = this.editingPolicy();
    const request = editing
      ? this.adminPolicyService.updatePolicy(editing.id, { ...payload, id: editing.id })
      : this.adminPolicyService.createPolicy(payload);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeForm();
        this.loadPolicies();
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to save policy.');
      }
    });
  }

  toggleActive(policy: Policy) {
    this.adminPolicyService.toggleActive(policy.id, !policy.isActive)
      .subscribe(() => this.loadPolicies());
  }

  deletePolicy(policy: Policy) {
    if (!confirm(`Delete "${policy.name}"? This cannot be undone.`)) return;
    this.adminPolicyService.deletePolicy(policy.id)
      .subscribe(() => this.loadPolicies());
  }
}