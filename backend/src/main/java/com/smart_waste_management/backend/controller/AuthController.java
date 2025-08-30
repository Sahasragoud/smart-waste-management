package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.AuthResponse;
import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) {
        User user = authService.createUser(request);
        user.setRole(Role.USER);
        AuthResponse response = new AuthResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().toString()
        );
        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest) throws UserNotFoundException {
        User user = authService.loginUser(loginRequest);
        AuthResponse response = new AuthResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()
        );
        return ResponseEntity.ok(response);
    }
}
