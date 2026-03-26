package com.example.voting.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PollResponse {
    private Long id;
    private String question;
    private LocalDateTime createdAt;
    private List<OptionResponse> options;
    private boolean hasVoted;
    private int totalVotes;

    public static class OptionResponse {
        private Long id;
        private String optionText;
        private int voteCount;

        public OptionResponse(Long id, String optionText, int voteCount) {
            this.id = id;
            this.optionText = optionText;
            this.voteCount = voteCount;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        public int getVoteCount() { return voteCount; }
        public void setVoteCount(int voteCount) { this.voteCount = voteCount; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<OptionResponse> getOptions() { return options; }
    public void setOptions(List<OptionResponse> options) { this.options = options; }
    public boolean isHasVoted() { return hasVoted; }
    public void setHasVoted(boolean hasVoted) { this.hasVoted = hasVoted; }
    public int getTotalVotes() { return totalVotes; }
    public void setTotalVotes(int totalVotes) { this.totalVotes = totalVotes; }
}
