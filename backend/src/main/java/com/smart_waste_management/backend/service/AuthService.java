package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.LoginResponse;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public LoginResponse createUser(RegisterRequest request);
    public LoginResponse loginUser(LoginRequest request) throws UserNotFoundException;
}
