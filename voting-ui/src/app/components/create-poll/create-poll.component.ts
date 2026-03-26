import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollService } from '../../services/poll.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <h1 class="mb-4">Create a Poll</h1>

          <div class="card shadow-sm">
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="question" class="form-label fw-semibold">Question</label>
                  <input id="question" type="text" class="form-control" [(ngModel)]="question"
                         name="question" placeholder="What would you like to ask?" required maxlength="500">
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Options</label>
                  <div *ngFor="let opt of options; let i = index; trackBy: trackByIndex" class="input-group mb-2">
                    <input type="text" class="form-control" [(ngModel)]="options[i]" [name]="'option-' + i"
                           placeholder="Option {{ i + 1 }}" required maxlength="200">
                    <button *ngIf="options.length > 2" type="button" class="btn btn-outline-danger"
                            (click)="removeOption(i)">&times;</button>
                  </div>
                  <button *ngIf="options.length < 10" type="button" class="btn btn-outline-secondary btn-sm w-100"
                          (click)="addOption()">+ Add Option</button>
                </div>

                <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="!isValid()">Create Poll</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreatePollComponent {
  question = '';
  options = ['', ''];
  error = '';

  constructor(private pollService: PollService, private router: Router) {}

  trackByIndex(index: number): number { return index; }

  addOption(): void {
    if (this.options.length < 10) this.options.push('');
  }

  removeOption(index: number): void {
    if (this.options.length > 2) this.options.splice(index, 1);
  }

  isValid(): boolean {
    return this.question.trim().length > 0 && this.options.every(o => o.trim().length > 0);
  }

  onSubmit(): void {
    if (!this.isValid()) return;
    this.error = '';
    this.pollService.createPoll({
      question: this.question.trim(),
      options: this.options.map(o => o.trim())
    }).subscribe({
      next: (poll) => this.router.navigate(['/polls', poll.id]),
      error: () => this.error = 'Failed to create poll. Please try again.'
    });
  }
}
