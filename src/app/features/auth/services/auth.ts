import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';
import { AuthUser, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private currentUser: AuthUser | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    role?: 'customer' | 'employee' | 'admin'
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, {
        name,
        email,
        password,
        role
      })
      .pipe(
        tap((res) => {
          this.currentUser = res.user;
          localStorage.setItem('auth_token', res.accessToken);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
        }),
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.currentUser = res.user;
          localStorage.setItem('auth_token', res.accessToken);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
        }),
      );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): AuthUser | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(...roles: Array<'customer' | 'employee' | 'admin'>): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }
}
