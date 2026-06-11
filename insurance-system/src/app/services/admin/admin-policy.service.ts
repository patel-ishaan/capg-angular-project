import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class AdminPolicyService {
  private BASE_URL = 'http://localhost:3000';
  private http = inject(HttpClient);

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.BASE_URL}/policies`);
  }

  createPolicy(policy: Omit<Policy, 'id'>): Observable<Policy> {
    return this.http.post<Policy>(`${this.BASE_URL}/policies`, policy);
  }

  updatePolicy(id: string, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.BASE_URL}/policies/${id}`, policy);
  }

  toggleActive(id: string, isActive: boolean): Observable<Policy> {
    return this.http.patch<Policy>(`${this.BASE_URL}/policies/${id}`, { isActive });
  }

  deletePolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/policies/${id}`);
  }
}