package com.example.voting.dto;

import jakarta.validation.constraints.NotNull;

public class CastVoteRequest {
    @NotNull(message = "Option ID is required")
    private Long optionId;

    public Long getOptionId() { return optionId; }
    public void setOptionId(Long optionId) { this.optionId = optionId; }
}
