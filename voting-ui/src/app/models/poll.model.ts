export interface OptionResponse {
  id: number;
  optionText: string;
  voteCount: number;
}

export interface PollResponse {
  id: number;
  question: string;
  createdAt: string;
  options: OptionResponse[];
  hasVoted: boolean;
  totalVotes: number;
}

export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface CastVoteRequest {
  optionId: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string | null;
  role: string | null;
  authenticated: boolean;
}
