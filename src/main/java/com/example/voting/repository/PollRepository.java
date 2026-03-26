package com.example.voting.repository;

import com.example.voting.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PollRepository extends JpaRepository<Poll, Long> {

    @Query("SELECT DISTINCT p FROM Poll p JOIN FETCH p.options WHERE p.id = :id")
    Optional<Poll> findByIdWithOptions(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Poll p JOIN FETCH p.options")
    List<Poll> findAllWithOptions();
}
