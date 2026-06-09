export interface Claim {
  id: string;
  purchaseId: string;
  incidentDate: Date;
  claimAmount: number;
  description: string;
  documents: ClaimDocument[];
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'additional_docs_required';
  adminRemarks?: string;
  submittedAt: Date;
  updatedAt: Date;
}

export interface ClaimDocument {
  type: string;  
  url: string;
  verified: boolean;
}