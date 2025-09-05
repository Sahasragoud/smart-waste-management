package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.dto.AuthResponse;
import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.LoginResponse;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.AuthService;
import com.smart_waste_management.backend.util.JWTUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public LoginResponse createUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhoneNumber(request.getPhoneNumber());
        if(request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()){
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }
        user.setRole(Role.USER);
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole().toString());
        return new LoginResponse(saved, token);
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) throws UserNotFoundException {
        User user = userRepository.findByEmail(request.getEmail());
        if(user == null){
            throw new UserNotFoundException("User not found by email, " + request.getEmail());
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }
        String token =  jwtUtil.generateToken(user.getUsername(), user.getRole().toString());

        return new LoginResponse(user, token);
    }

}
