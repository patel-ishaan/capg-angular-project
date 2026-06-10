import { Injectable } from '@angular/core';
import { Policy } from '../../models/policy.model';

export interface PolicySearchFilters {
  type?: string;
  minPremium?: number | null;
  maxPremium?: number | null;
  userAge?: number | null;
  minTerm?: number | null;
  maxTerm?: number | null;
  searchText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicySearchService {

  filterPolicies(policies: Policy[], filters: PolicySearchFilters): Policy[] {
    return policies.filter(policy => {

      // filter by type
      if (filters.type && filters.type !== '') {
        if (policy.type !== filters.type) return false;
      }

      // filter by min premium
      if (filters.minPremium != null && filters.minPremium > 0) {
        if (policy.premiumAmount < filters.minPremium) return false;
      }

      // filter by max premium
      if (filters.maxPremium != null && filters.maxPremium > 0) {
        if (policy.premiumAmount > filters.maxPremium) return false;
      }

      // filter by user age — must fall within policy's minAge and maxAge
      if (filters.userAge != null && filters.userAge > 0) {
        if (filters.userAge < policy.minAge || filters.userAge > policy.maxAge) return false;
      }

      // filter by min term
      if (filters.minTerm != null && filters.minTerm > 0) {
        if (policy.termYears < filters.minTerm) return false;
      }

      // filter by max term
      if (filters.maxTerm != null && filters.maxTerm > 0) {
        if (policy.termYears > filters.maxTerm) return false;
      }

      // filter by search text — matches name
      if (filters.searchText && filters.searchText.trim() !== '') {
        const text = filters.searchText.toLowerCase();
        if (!policy.name.toLowerCase().includes(text)) return false;
      }

      return true;
    });
  }

  // helper to get unique types from policies
  getTypes(policies: Policy[]): string[] {
    return [...new Set(policies.map(p => p.type))];
  }

  // helper to get premium range from policies
  getPremiumRange(policies: Policy[]): { min: number; max: number } {
    const premiums = policies.map(p => p.premiumAmount);
    return {
      min: Math.min(...premiums),
      max: Math.max(...premiums)
    };
  }
}