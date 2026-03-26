package com.example.voting.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI votingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Voting App API")
                        .description("REST API for creating polls, casting votes, and managing authentication")
                        .version("1.0.0"));
    }
}
