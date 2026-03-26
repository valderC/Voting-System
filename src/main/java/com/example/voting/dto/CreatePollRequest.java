package com.example.voting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreatePollRequest {
    @NotBlank(message = "Question is required")
    private String question;

    @Size(min = 2, max = 10, message = "A poll must have between 2 and 10 options")
    private List<@NotBlank(message = "Option text cannot be blank") String> options;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
}
