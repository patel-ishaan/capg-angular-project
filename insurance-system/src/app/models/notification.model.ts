export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: 'purchase' | 'payment' | 'claim' | 'admin';
  read: boolean;
  createdAt: string;
}