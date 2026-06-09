import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {

    // Step 1: check if email already exists
    return this.http.get<User[]>(`${this.BASE_URL}/users?email=${email}`).pipe(

      switchMap(users => {
        if (users.length > 0) {
          throw new Error('Email already registered');
        }

        // Step 2: if email is free, POST the new user
        const newUser = { name, email, password, role: 'customer' };
        return this.http.post<User>(`${this.BASE_URL}/users`, newUser);
      }),

      catchError(err => throwError(() => err))
    );
  }
}