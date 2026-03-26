import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PollService } from './poll.service';

describe('PollService', () => {
  let service: PollService;
  let httpMock: HttpTestingController;

  const mockPoll = {
    id: 1,
    question: 'Test?',
    createdAt: '2026-01-01T00:00:00',
    options: [
      { id: 1, optionText: 'A', voteCount: 0 },
      { id: 2, optionText: 'B', voteCount: 0 },
    ],
    hasVoted: false,
    totalVotes: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PollService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all polls', () => {
    service.getAllPolls().subscribe(polls => {
      expect(polls.length).toBe(1);
      expect(polls[0].question).toBe('Test?');
    });

    const req = httpMock.expectOne('/api/polls');
    expect(req.request.method).toBe('GET');
    req.flush([mockPoll]);
  });

  it('should get a poll by id', () => {
    service.getPoll(1).subscribe(poll => {
      expect(poll.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/polls/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPoll);
  });

  it('should create a poll', () => {
    service.createPoll({ question: 'New?', options: ['X', 'Y'] }).subscribe(poll => {
      expect(poll.question).toBe('Test?');
    });

    const req = httpMock.expectOne('/api/polls');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ question: 'New?', options: ['X', 'Y'] });
    req.flush(mockPoll);
  });

  it('should update a poll', () => {
    service.updatePoll(1, { question: 'Updated?', options: ['A', 'B'] }).subscribe(poll => {
      expect(poll).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/polls/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockPoll);
  });

  it('should delete a poll', () => {
    service.deletePoll(1).subscribe();

    const req = httpMock.expectOne('/api/polls/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should cast a vote', () => {
    service.castVote(1, { optionId: 2 }).subscribe(poll => {
      expect(poll.hasVoted).toBe(true);
    });

    const req = httpMock.expectOne('/api/polls/1/votes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ optionId: 2 });
    req.flush({ ...mockPoll, hasVoted: true, totalVotes: 1 });
  });
});
