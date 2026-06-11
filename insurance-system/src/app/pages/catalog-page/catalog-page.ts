import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NavbarComponent } from '../../components/navbar/navbar';
import { loadPolicies, selectPolicyForComparison } from '../../store/policy/policy.actions';
import { selectAllPolicies, selectPoliciesLoading, selectComparisonPolicies } from '../../store/policy/policy.selectors';
import { Policy } from '../../models/policy.model';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, AsyncPipe,DecimalPipe],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css'
})
export class CatalogPageComponent implements OnInit {
  private store = inject(Store);

  policies$ = this.store.select(selectAllPolicies);
  loading$ = this.store.select(selectPoliciesLoading);
  comparison$ = this.store.select(selectComparisonPolicies);

  ngOnInit() {
    this.store.dispatch(loadPolicies());
  }

  addToCompare(policy: Policy) {
    this.store.dispatch(selectPolicyForComparison({ policy }));
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      health: '🏥',
      life: '🛡️',
      vehicle: '🚗'
    };
    return icons[type] || '📋';
  }
}