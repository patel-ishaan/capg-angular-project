import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PolicyState } from './policy.reducer';

// get the entire policy slice from store
export const selectPolicyState = createFeatureSelector<PolicyState>('policy');

// get just the policies array
export const selectAllPolicies = createSelector(
  selectPolicyState,
  (state) => state.policies
);

// get loading state
export const selectPoliciesLoading = createSelector(
  selectPolicyState,
  (state) => state.loading
);

// get error
export const selectPoliciesError = createSelector(
  selectPolicyState,
  (state) => state.error
);

// get selected policies for comparison
export const selectComparisonPolicies = createSelector(
  selectPolicyState,
  (state) => state.selectedForComparison
);

// get count of selected comparison policies
export const selectComparisonCount = createSelector(
  selectPolicyState,
  (state) => state.selectedForComparison.length
);