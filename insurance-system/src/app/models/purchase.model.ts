export interface Purchase {
  id: string;
  policyId: string;
  customerId: string;
  purchaseDate: Date;
  startDate: Date;
  endDate: Date;
  selectedNominees: { nomineeId: string; percentage: number }[];
  status: 'active' | 'expired' | 'cancelled';
  policyDocumentUrl: string;
}