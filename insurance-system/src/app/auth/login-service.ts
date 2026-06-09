import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BASE_URL = 'http://localhost:3000';
  private USER_KEY = 'logged_in_user';

  currentUser = signal<User | null>(this.getStoredUser());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.get<User[]>(
      `${this.BASE_URL}/users?email=${email}&password=${password}`
    ).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Invalid email or password');
        }
        const user = users[0];
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        return user;
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}