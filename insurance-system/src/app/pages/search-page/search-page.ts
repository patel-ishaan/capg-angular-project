import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NavbarComponent } from '../../components/navbar/navbar';
import { loadPolicies, selectPolicyForComparison } from '../../store/policy/policy.actions';
import { selectAllPolicies, selectPoliciesLoading } from '../../store/policy/policy.selectors';
// import { PolicySearchService, PolicySearchFilters } from '../../services/user/policy-search.service';
import { PolicySearchService,PolicySearchFilters } from '../../services/user/policy-search';
import { Policy } from '../../models/policy.model';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FormsModule, AsyncPipe, DecimalPipe],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPageComponent implements OnInit {
  private store = inject(Store);
  private searchService = inject(PolicySearchService);

  allPolicies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  loading$ = this.store.select(selectPoliciesLoading);

  filters: PolicySearchFilters = {
    type: '',
    minPremium: null,
    maxPremium: null,
    userAge: null,
    minTerm: null,
    maxTerm: null,
    searchText: ''
  };

  ngOnInit() {
    this.store.dispatch(loadPolicies());
    this.store.select(selectAllPolicies).subscribe(policies => {
      this.allPolicies = policies;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredPolicies = this.searchService.filterPolicies(this.allPolicies, this.filters);
  }

  resetFilters() {
    this.filters = {
      type: '',
      minPremium: null,
      maxPremium: null,
      userAge: null,
      minTerm: null,
      maxTerm: null,
      searchText: ''
    };
    this.applyFilters();
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