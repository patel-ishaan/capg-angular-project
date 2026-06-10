import { createReducer, on } from '@ngrx/store';
import { Policy } from '../../models/policy.model';
import {
  loadPolicies,
  loadPoliciesSuccess,
  loadPoliciesFailure,
  selectPolicyForComparison,
  removePolicyFromComparison,
  clearComparison
} from './policy.actions';

export interface PolicyState {
  policies: Policy[];
  selectedForComparison: Policy[];
  loading: boolean;
  error: string | null;
}

export const initialState: PolicyState = {
  policies: [],
  selectedForComparison: [],
  loading: false,
  error: null
};

export const policyReducer = createReducer(
  initialState,

  // when loadPolicies is dispatched → set loading true
  on(loadPolicies, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  // when success → save policies, stop loading
  on(loadPoliciesSuccess, (state, { policies }) => ({
    ...state,
    policies,
    loading: false,
    error: null
  })),

  // when failure → save error, stop loading
  on(loadPoliciesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // add policy to comparison (max 3)
  on(selectPolicyForComparison, (state, { policy }) => {
    if (state.selectedForComparison.length >= 3) return state;
    if (state.selectedForComparison.find(p => p.id === policy.id)) return state;
    return {
      ...state,
      selectedForComparison: [...state.selectedForComparison, policy]
    };
  }),

  // remove policy from comparison
  on(removePolicyFromComparison, (state, { policyId }) => ({
    ...state,
    selectedForComparison: state.selectedForComparison.filter(p => p.id !== policyId)
  })),

  // clear all comparison
  on(clearComparison, (state) => ({
    ...state,
    selectedForComparison: []
  }))
);