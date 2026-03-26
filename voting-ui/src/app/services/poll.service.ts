import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PollResponse, CreatePollRequest, CastVoteRequest } from '../models/poll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = '/api/polls';

  constructor(private http: HttpClient) {}

  getAllPolls(): Observable<PollResponse[]> {
    return this.http.get<PollResponse[]>(this.apiUrl, { withCredentials: true });
  }

  getPoll(id: number): Observable<PollResponse> {
    return this.http.get<PollResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createPoll(request: CreatePollRequest): Observable<PollResponse> {
    return this.http.post<PollResponse>(this.apiUrl, request, { withCredentials: true });
  }

  castVote(pollId: number, request: CastVoteRequest): Observable<PollResponse> {
    return this.http.post<PollResponse>(`${this.apiUrl}/${pollId}/votes`, request, { withCredentials: true });
  }

  updatePoll(id: number, request: CreatePollRequest): Observable<PollResponse> {
    return this.http.put<PollResponse>(`${this.apiUrl}/${id}`, request, { withCredentials: true });
  }

  deletePoll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
