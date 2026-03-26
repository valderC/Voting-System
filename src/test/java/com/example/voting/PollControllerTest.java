package com.example.voting;

import com.example.voting.dto.CastVoteRequest;
import com.example.voting.dto.CreatePollRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(roles = "ADMIN")
class PollControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createPoll_returnsCreated() throws Exception {
        CreatePollRequest request = new CreatePollRequest();
        request.setQuestion("What is your favorite color?");
        request.setOptions(List.of("Red", "Blue", "Green"));

        mockMvc.perform(post("/api/polls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.question").value("What is your favorite color?"))
                .andExpect(jsonPath("$.options.length()").value(3));
    }

    @Test
    void getPoll_returnsOk() throws Exception {
        // Create a poll first
        CreatePollRequest request = new CreatePollRequest();
        request.setQuestion("Test poll?");
        request.setOptions(List.of("A", "B"));

        MvcResult result = mockMvc.perform(post("/api/polls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long pollId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/polls/" + pollId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.question").value("Test poll?"));
    }

    @Test
    void getPoll_notFound() throws Exception {
        mockMvc.perform(get("/api/polls/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void castVote_returnsOk() throws Exception {
        MockHttpSession session = new MockHttpSession();

        CreatePollRequest request = new CreatePollRequest();
        request.setQuestion("Vote test?");
        request.setOptions(List.of("X", "Y"));

        MvcResult result = mockMvc.perform(post("/api/polls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        var json = objectMapper.readTree(result.getResponse().getContentAsString());
        Long pollId = json.get("id").asLong();
        Long optionId = json.get("options").get(0).get("id").asLong();

        CastVoteRequest voteRequest = new CastVoteRequest();
        voteRequest.setOptionId(optionId);

        mockMvc.perform(post("/api/polls/" + pollId + "/votes")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVotes").value(1))
                .andExpect(jsonPath("$.hasVoted").value(true));
    }

    @Test
    void castDuplicateVote_returnsConflict() throws Exception {
        MockHttpSession session = new MockHttpSession();

        CreatePollRequest request = new CreatePollRequest();
        request.setQuestion("Duplicate test?");
        request.setOptions(List.of("A", "B"));

        MvcResult result = mockMvc.perform(post("/api/polls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        var json = objectMapper.readTree(result.getResponse().getContentAsString());
        Long pollId = json.get("id").asLong();
        Long optionId = json.get("options").get(0).get("id").asLong();

        CastVoteRequest voteRequest = new CastVoteRequest();
        voteRequest.setOptionId(optionId);

        // First vote
        mockMvc.perform(post("/api/polls/" + pollId + "/votes")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteRequest)))
                .andExpect(status().isOk());

        // Duplicate vote
        mockMvc.perform(post("/api/polls/" + pollId + "/votes")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void listPolls_returnsOk() throws Exception {
        mockMvc.perform(get("/api/polls"))
                .andExpect(status().isOk());
    }
}
