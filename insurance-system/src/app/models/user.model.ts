export interface User {
  id: string;
  email: string;
  password: string;       
  name: string;
  role: 'customer' | 'admin';
}

export interface CustomerProfile {
  dateOfBirth: Date;
  address: Address;
  communicationPref: CommunicationPref;
  nominees: Nominee[];
}

export interface Nominee {
  id: string;
  fullName: string;
  relationship: string;
  percentage: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CommunicationPref {
  emailAlerts: boolean;
  smsReminders: boolean;
  marketingEmails: boolean;
}