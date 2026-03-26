import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/poll.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">Voting App</a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">All Polls</a>
          <a *ngIf="isAdmin" class="nav-link" routerLink="/create" routerLinkActive="active">Create Poll</a>
          <span *ngIf="currentUser?.authenticated" class="nav-link text-light">{{ currentUser?.username }}</span>
          <a *ngIf="!currentUser?.authenticated" class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
          <a *ngIf="currentUser?.authenticated" class="nav-link" href="#" (click)="logout($event)">Logout</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }
}
