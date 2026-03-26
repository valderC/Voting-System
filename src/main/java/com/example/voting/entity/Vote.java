package com.example.voting.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes",
        uniqueConstraints = @UniqueConstraint(name = "uk_vote_session_poll", columnNames = {"session_id", "poll_id"}),
        indexes = @Index(name = "idx_vote_session_id", columnList = "session_id"))
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private PollOption option;

    @Column(name = "poll_id", nullable = false)
    private Long pollId;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    @Column(name = "voted_at")
    private LocalDateTime votedAt = LocalDateTime.now();

    public Vote() {}

    public Vote(PollOption option, Long pollId, String sessionId) {
        this.option = option;
        this.pollId = pollId;
        this.sessionId = sessionId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PollOption getOption() { return option; }
    public void setOption(PollOption option) { this.option = option; }
    public Long getPollId() { return pollId; }
    public void setPollId(Long pollId) { this.pollId = pollId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public LocalDateTime getVotedAt() { return votedAt; }
    public void setVotedAt(LocalDateTime votedAt) { this.votedAt = votedAt; }
}
