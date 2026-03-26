package com.example.voting.service;

import com.example.voting.dto.CreatePollRequest;
import com.example.voting.dto.PollResponse;
import com.example.voting.entity.Poll;
import com.example.voting.entity.PollOption;
import com.example.voting.entity.Vote;
import com.example.voting.exception.DuplicateVoteException;
import com.example.voting.exception.ResourceNotFoundException;
import com.example.voting.repository.PollOptionRepository;
import com.example.voting.repository.PollRepository;
import com.example.voting.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final VoteRepository voteRepository;

    public PollService(PollRepository pollRepository, PollOptionRepository pollOptionRepository, VoteRepository voteRepository) {
        this.pollRepository = pollRepository;
        this.pollOptionRepository = pollOptionRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional
    public PollResponse createPoll(CreatePollRequest request) {
        Poll poll = new Poll(request.getQuestion());
        for (String optionText : request.getOptions()) {
            PollOption option = new PollOption(optionText, poll);
            poll.getOptions().add(option);
        }
        poll = pollRepository.save(poll);
        return toPollResponse(poll, null);
    }

    @Transactional(readOnly = true)
    public PollResponse getPoll(Long id, String sessionId) {
        Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + id));
        return toPollResponse(poll, sessionId);
    }

    @Transactional(readOnly = true)
    public List<PollResponse> getAllPolls(String sessionId) {
        return pollRepository.findAll().stream()
                .map(poll -> toPollResponse(poll, sessionId))
                .toList();
    }

    @Transactional
    public PollResponse updatePoll(Long id, CreatePollRequest request) {
        Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + id));
        poll.setQuestion(request.getQuestion());
        poll.getOptions().clear();
        for (String optionText : request.getOptions()) {
            PollOption option = new PollOption(optionText, poll);
            poll.getOptions().add(option);
        }
        poll = pollRepository.save(poll);
        return toPollResponse(poll, null);
    }

    @Transactional
    public void deletePoll(Long id) {
        Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + id));
        pollRepository.delete(poll);
    }

    @Transactional
    public PollResponse castVote(Long pollId, Long optionId, String sessionId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + pollId));

        voteRepository.findBySessionIdAndOption_Poll_Id(sessionId, pollId)
                .ifPresent(v -> { throw new DuplicateVoteException("You have already voted on this poll"); });

        PollOption option = poll.getOptions().stream()
                .filter(o -> o.getId().equals(optionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + optionId));

        Vote vote = new Vote(option, sessionId);
        voteRepository.save(vote);

        // Refresh to get updated counts
        poll = pollRepository.findById(pollId).orElseThrow();
        return toPollResponse(poll, sessionId);
    }

    private PollResponse toPollResponse(Poll poll, String sessionId) {
        PollResponse response = new PollResponse();
        response.setId(poll.getId());
        response.setQuestion(poll.getQuestion());
        response.setCreatedAt(poll.getCreatedAt());

        List<PollResponse.OptionResponse> optionResponses = poll.getOptions().stream()
                .map(o -> new PollResponse.OptionResponse(o.getId(), o.getOptionText(), o.getVotes().size()))
                .toList();

        response.setOptions(optionResponses);
        response.setTotalVotes(optionResponses.stream().mapToInt(PollResponse.OptionResponse::getVoteCount).sum());

        if (sessionId != null) {
            response.setHasVoted(voteRepository.findBySessionIdAndOption_Poll_Id(sessionId, poll.getId()).isPresent());
        }

        return response;
    }
}
