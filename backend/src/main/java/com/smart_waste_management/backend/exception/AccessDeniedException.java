package com.smart_waste_management.backend.exception;

public class AccessDeniedException extends Exception{
    public AccessDeniedException(String message){
        super(message);
    }
}
