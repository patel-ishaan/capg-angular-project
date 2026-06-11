import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn:'root'
})
export class PolicyService {

  private API_URL='http://localhost:3000/policies';

  constructor(private http:HttpClient){}

  getPolicies(){
    return this.http.get<any[]>(this.API_URL);
  }
}