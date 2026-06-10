import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyCatalogService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.BASE_URL}/policies`);
  }

  getActivePolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.BASE_URL}/policies?isActive=true`);
  }

  getPolicyById(id: string): Observable<Policy> {
    return this.http.get<Policy>(`${this.BASE_URL}/policies/${id}`);
  }

  getPoliciesByType(type: 'health' | 'life' | 'vehicle'): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.BASE_URL}/policies?type=${type}&isActive=true`);
  }
}