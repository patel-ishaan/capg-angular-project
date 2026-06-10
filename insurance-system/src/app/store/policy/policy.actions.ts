import { createAction, props } from '@ngrx/store';
import { Policy } from '../../models/policy.model';

// Load all policies
export const loadPolicies = createAction(
  '[Policy Catalog] Load Policies'
);

export const loadPoliciesSuccess = createAction(
  '[Policy Catalog] Load Policies Success',
  props<{ policies: Policy[] }>()
);

export const loadPoliciesFailure = createAction(
  '[Policy Catalog] Load Policies Failure',
  props<{ error: string }>()
);

// Select/deselect for comparison
export const selectPolicyForComparison = createAction(
  '[Policy Catalog] Select Policy For Comparison',
  props<{ policy: Policy }>()
);

export const removePolicyFromComparison = createAction(
  '[Policy Catalog] Remove Policy From Comparison',
  props<{ policyId: string }>()
);

export const clearComparison = createAction(
  '[Policy Catalog] Clear Comparison'
);