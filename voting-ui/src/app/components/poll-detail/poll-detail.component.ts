import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';
import { PollResponse, OptionResponse } from '../../models/poll.model';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6" *ngIf="poll">
          <h1 class="mb-4">{{ poll.question }}</h1>

          <div *ngIf="isAdmin" class="mb-3 d-flex gap-2">
            <a [routerLink]="['/polls', poll.id, 'edit']" class="btn btn-outline-secondary btn-sm">Edit</a>
            <button class="btn btn-outline-danger btn-sm" (click)="confirmDelete()">Delete</button>
          </div>

          <!-- Voting view -->
          <div *ngIf="!poll.hasVoted && !justVoted" class="d-grid gap-2">
            <button *ngFor="let option of poll.options" (click)="vote(option)"
                    class="btn btn-outline-primary btn-lg text-start" [disabled]="voting">
              {{ option.optionText }}
            </button>
          </div>

          <!-- Results view -->
          <div *ngIf="poll.hasVoted || justVoted">
            <div *ngFor="let option of poll.options" class="card mb-2 shadow-sm">
              <div class="card-body py-2 px-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="fw-semibold">{{ option.optionText }}</span>
                  <span class="text-muted small">{{ option.voteCount }} vote{{ option.voteCount !== 1 ? 's' : '' }} ({{ getPercentage(option) }}%)</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" role="progressbar"
                       [style.width.%]="getPercentage(option)"
                       [attr.aria-valuenow]="getPercentage(option)"
                       aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
            <p class="text-center text-muted mt-3">Total votes: {{ poll.totalVotes }}</p>
          </div>

          <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>

          <a routerLink="/" class="btn btn-link mt-3 ps-0">&larr; Back to all polls</a>
        </div>

        <div class="col-md-8 col-lg-6" *ngIf="notFound">
          <h1>Poll not found</h1>
          <a routerLink="/" class="btn btn-link ps-0">&larr; Back to all polls</a>
        </div>
      </div>
    </div>
  `
})
export class PollDetailComponent implements OnInit {
  poll: PollResponse | null = null;
  notFound = false;
  voting = false;
  justVoted = false;
  error = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollService: PollService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pollService.getPoll(id).subscribe({
      next: (poll) => this.poll = poll,
      error: () => this.notFound = true
    });
    this.authService.currentUser$.subscribe(() => {
      this.isAdmin = this.authService.isAdmin();
    });
  }

  getPercentage(option: OptionResponse): number {
    if (!this.poll || this.poll.totalVotes === 0) return 0;
    return Math.round((option.voteCount / this.poll.totalVotes) * 100);
  }

  vote(option: OptionResponse): void {
    if (!this.poll || this.voting) return;
    this.voting = true;
    this.error = '';
    this.pollService.castVote(this.poll.id, { optionId: option.id }).subscribe({
      next: (updatedPoll) => {
        this.poll = updatedPoll;
        this.justVoted = true;
        this.voting = false;
      },
      error: (err) => {
        this.voting = false;
        if (err.status === 409) {
          this.error = 'You have already voted on this poll.';
          this.justVoted = true;
        } else {
          this.error = 'Failed to cast vote. Please try again.';
        }
      }
    });
  }

  confirmDelete(): void {
    if (!this.poll) return;
    if (window.confirm('Are you sure you want to delete this poll?')) {
      this.pollService.deletePoll(this.poll.id).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.error = 'Failed to delete poll.'
      });
    }
  }
}
