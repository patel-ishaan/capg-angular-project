// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  getUserPurchases(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/purchases?customerId=${userId}`);
  }

  getUserClaims(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/claims?customerId=${userId}`);
  }

  getCustomerProfileByUserId(userId: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/customerProfiles?userId=${userId}`)
      .pipe(map((profiles) => (profiles.length ? profiles[0] : null)));
  }

  toggleUserRole(user: User): Observable<User> {
    const newRole = user.role === 'customer' ? 'admin' : 'customer';
    return this.http.patch<User>(`${this.apiUrl}/users/${user.id}`, { role: newRole });
  }
}
