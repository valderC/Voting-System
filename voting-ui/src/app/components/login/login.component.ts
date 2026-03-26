import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <h1 class="mb-4">Admin Login</h1>

          <div class="card shadow-sm">
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">Username</label>
                  <input id="username" type="text" class="form-control" [(ngModel)]="username"
                         name="username" required autofocus>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label fw-semibold">Password</label>
                  <input id="password" type="password" class="form-control" [(ngModel)]="password"
                         name="password" required>
                </div>
                <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
                <button type="submit" class="btn btn-primary w-100" [disabled]="!username || !password">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Invalid username or password.'
    });
  }
}
