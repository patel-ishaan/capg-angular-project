export interface Payment {
  id: string;
  purchaseId: string;
  customerId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'paid' | 'due' | 'overdue';
  paymentMethod: string;
}
