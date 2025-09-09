package com.smart_waste_management.backend.exception;

import com.smart_waste_management.backend.dto.ErrorResponse;
import com.smart_waste_management.backend.entity.Uploads;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("UserNotFoundException", ex.getMessage(), 404));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("RuntimeException", ex.getMessage(), 400));
    }

    @ExceptionHandler(UploadNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUploadNotFound(UploadNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("UploadNotFoundException", ex.getMessage(), 404));
    }
}