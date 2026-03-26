import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';
import { PollResponse } from '../../models/poll.model';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <h1 class="mb-4">All Polls</h1>

      <div *ngIf="polls.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
        <p class="text-muted mb-0">No polls yet.
          <a *ngIf="isAdmin" routerLink="/create">Create one!</a>
        </p>
      </div>

      <div class="row g-3">
        <div *ngFor="let poll of polls" class="col-md-6">
          <a [routerLink]="['/polls', poll.id]" class="card text-decoration-none h-100 poll-card">
            <div class="card-body">
              <h5 class="card-title text-dark">{{ poll.question }}</h5>
              <div class="d-flex gap-3 text-muted small">
                <span>{{ poll.options.length }} options</span>
                <span>{{ poll.totalVotes }} vote{{ poll.totalVotes !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .poll-card {
      transition: box-shadow 0.2s;
      &:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class PollListComponent implements OnInit {
  polls: PollResponse[] = [];
  isAdmin = false;

  constructor(private pollService: PollService, private authService: AuthService) {}

  ngOnInit(): void {
    this.pollService.getAllPolls().subscribe(polls => this.polls = polls);
    this.authService.currentUser$.subscribe(() => {
      this.isAdmin = this.authService.isAdmin();
    });
  }
}
