import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { NavbarComponent } from '../navbar/navbar';
import { loadPolicies } from '../../store/policy/policy.actions';
import { selectAllPolicies, selectComparisonPolicies } from '../../store/policy/policy.selectors';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-compare-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, DecimalPipe],
  templateUrl: './compare-policies.html',
  styleUrl: './compare-policies.css'
})
export class ComparePoliciesComponent implements OnInit {
  private store = inject(Store);

  allPolicies = signal<Policy[]>([]);
  loading = signal(true);

  selectedId1 = '';
  selectedId2 = '';

  get policy1(): Policy | null {
    return this.allPolicies().find(p => p.id === this.selectedId1) ?? null;
  }

  get policy2(): Policy | null {
    return this.allPolicies().find(p => p.id === this.selectedId2) ?? null;
  }

  ngOnInit() {
    this.store.dispatch(loadPolicies());

    this.store.select(selectAllPolicies).subscribe(policies => {
      this.allPolicies.set(policies);
      if (policies.length > 0) this.loading.set(false);
    });

    // Pre-fill selections from catalog/search "Compare" button
    this.store.select(selectComparisonPolicies).subscribe(selected => {
      if (selected.length >= 1) this.selectedId1 = selected[0].id;
      if (selected.length >= 2) this.selectedId2 = selected[1].id;
    });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = { health: '🏥', life: '🛡️', vehicle: '🚗' };
    return icons[type] || '📋';
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
