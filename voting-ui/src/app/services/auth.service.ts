import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/poll.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  checkAuth(): void {
    this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true }).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next({ username: null, role: null, authenticated: false })
    });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.authenticated && user.role === 'ROLE_ADMIN';
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.authenticated;
  }
}
