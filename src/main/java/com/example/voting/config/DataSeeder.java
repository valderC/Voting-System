package com.example.voting.config;

import com.example.voting.entity.AppUser;
import com.example.voting.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAdmin(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                AppUser admin = new AppUser("admin", passwordEncoder.encode("admin123"), "ROLE_ADMIN");
                userRepository.save(admin);
            }
        };
    }
}
