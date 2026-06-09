export interface Policy {
  id: string;
  name: string;
  type: 'health' | 'life' | 'vehicle';
  coverageAmount: number;
  premiumAmount: number;
  termYears: number;
  minAge: number;
  maxAge: number;
  benefits: string[];
  exclusions: string[];
  isActive: boolean;
}