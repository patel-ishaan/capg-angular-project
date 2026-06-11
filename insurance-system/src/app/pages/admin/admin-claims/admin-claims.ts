import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Claim } from '../../../models/claim.model';
import { ClaimService } from '../../../services/claim/claim.service';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-claims.html',
  styleUrl: './admin-claims.css'
})
export class AdminClaimsComponent implements OnInit {

  private claimService = inject(ClaimService);

  claims = signal<Claim[]>([]);
  loading = signal(true);

  searchTerm = signal('');
  selectedStatus = signal('all');

  statuses = [
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'additional_docs_required'
  ];

  filteredClaims = computed(() => {

    return this.claims().filter(claim => {

      const search =
        this.searchTerm().toLowerCase();

      const matchesSearch =
        claim.id.toLowerCase().includes(search) ||
        claim.purchaseId.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus() === 'all' ||
        claim.status === this.selectedStatus();

      return matchesSearch && matchesStatus;
    });

  });

  totalClaims = computed(() => this.claims().length);

  pendingClaims = computed(() =>
    this.claims().filter(
      c =>
        c.status === 'submitted' ||
        c.status === 'under_review'
    ).length
  );

  approvedClaims = computed(() =>
    this.claims().filter(
      c => c.status === 'approved'
    ).length
  );

  rejectedClaims = computed(() =>
    this.claims().filter(
      c => c.status === 'rejected'
    ).length
  );

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {

    this.claimService.getAllClaims().subscribe({
      next: claims => {

        this.claims.set(claims);
        this.loading.set(false);

      },

      error: err => {

        console.error(err);
        this.loading.set(false);

      }
    });

  }

  updateStatus(
    claim: Claim,
    status: string
  ) {

    this.claimService.updateClaim(
      claim.id,
      {
        status: status as Claim['status'],
        updatedAt: new Date()
      }
    ).subscribe(() => {

      claim.status =
        status as Claim['status'];

    });

  }

  saveRemarks(
    claim: Claim,
    remarks: string
  ) {

    this.claimService.updateClaim(
      claim.id,
      {
        adminRemarks: remarks,
        updatedAt: new Date()
      }
    ).subscribe();

  }

  toggleDocument(
    claim: Claim,
    index: number
  ) {

    claim.documents[index].verified =
      !claim.documents[index].verified;

    this.claimService.updateClaim(
      claim.id,
      {
        documents: claim.documents,
        updatedAt: new Date()
      }
    ).subscribe();

  }

  getStatusLabel(status: string) {

    return status.replaceAll('_', ' ');

  }
}