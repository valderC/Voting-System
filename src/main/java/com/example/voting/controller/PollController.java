package com.example.voting.controller;

import com.example.voting.dto.CastVoteRequest;
import com.example.voting.dto.CreatePollRequest;
import com.example.voting.dto.PollResponse;
import com.example.voting.service.PollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
@Tag(name = "Polls", description = "Create, read, update, and delete polls")
public class PollController {

    private final PollService pollService;

    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    @PostMapping
    @Operation(summary = "Create a new poll", description = "Admin only. Creates a poll with 2-10 options.")
    @ApiResponse(responseCode = "201", description = "Poll created")
    public ResponseEntity<PollResponse> createPoll(@Valid @RequestBody CreatePollRequest request) {
        PollResponse response = pollService.createPoll(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a poll by ID", description = "Returns the poll with vote counts and whether the current session has voted.")
    @ApiResponse(responseCode = "200", description = "Poll found")
    @ApiResponse(responseCode = "404", description = "Poll not found")
    public ResponseEntity<PollResponse> getPoll(@PathVariable Long id, HttpSession session) {
        PollResponse response = pollService.getPoll(id, session.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "List all polls", description = "Returns all polls with vote counts.")
    public ResponseEntity<List<PollResponse>> getAllPolls(HttpSession session) {
        List<PollResponse> responses = pollService.getAllPolls(session.getId());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a poll", description = "Admin only. Replaces the question and all options (existing votes are cleared).")
    @ApiResponse(responseCode = "200", description = "Poll updated")
    @ApiResponse(responseCode = "404", description = "Poll not found")
    public ResponseEntity<PollResponse> updatePoll(@PathVariable Long id,
                                                    @Valid @RequestBody CreatePollRequest request) {
        PollResponse response = pollService.updatePoll(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a poll", description = "Admin only. Deletes the poll and all associated options and votes.")
    @ApiResponse(responseCode = "204", description = "Poll deleted")
    @ApiResponse(responseCode = "404", description = "Poll not found")
    public ResponseEntity<Void> deletePoll(@PathVariable Long id) {
        pollService.deletePoll(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/votes")
    @Operation(summary = "Cast a vote", description = "Public. One vote per session per poll. Returns 409 if already voted.")
    @ApiResponse(responseCode = "200", description = "Vote recorded")
    @ApiResponse(responseCode = "404", description = "Poll or option not found")
    @ApiResponse(responseCode = "409", description = "Already voted on this poll")
    public ResponseEntity<PollResponse> castVote(@PathVariable Long id,
                                                  @Valid @RequestBody CastVoteRequest request,
                                                  HttpSession session) {
        PollResponse response = pollService.castVote(id, request.getOptionId(), session.getId());
        return ResponseEntity.ok(response);
    }
}
