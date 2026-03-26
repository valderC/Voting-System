package com.example.voting.exception;

public class DuplicateVoteException extends RuntimeException {
    public DuplicateVoteException(String message) {
        super(message);
    }
}
