package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.dto.AuthResponse;
import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;


    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public User createUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        user.setRole(Role.valueOf("USER"));
        return userRepository.save(user);
    }

    @Override
    public User loginUser(LoginRequest request) throws UserNotFoundException {
        User user = userRepository.findByEmail(request.getEmail());
        if(user == null || !user.getRole().equals(Role.USER)){
            throw new UserNotFoundException("User not found by email, " + request.getEmail());
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }
        return user;
    }

}
