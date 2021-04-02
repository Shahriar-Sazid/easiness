package com.example.businesseasycore.exception_handler;

public class UniqueConstraintsViolationException extends RuntimeException {
    public UniqueConstraintsViolationException(String message) {
        super(message);
    }
}

