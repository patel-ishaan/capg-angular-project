import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomerProfile(userId: string) {
    return this.http.get<any[]>(
      `${this.BASE_URL}/customerProfiles?userId=${userId}`
    );
  }
}