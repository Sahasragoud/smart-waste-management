package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.dto.UpdateProfileRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
    }

    @Override
    public User updateUser(Long userId, UpdateProfileRequest profileRequest) throws UserNotFoundException {
        User user = userRepository.findByEmail(profileRequest.getEmail());
        if(user == null) {
            throw new UserNotFoundException("User not found by email, " + profileRequest.getEmail());
        }

        if(profileRequest.getUsername() != null) user.setUsername(profileRequest.getUsername());
        if(profileRequest.getEmail() != null) user.setEmail(profileRequest.getEmail());
        if(profileRequest.getAddress() != null) user.setAddress(profileRequest.getAddress());
        if(profileRequest.getPhoneNumber() != null) user.setPhoneNumber(profileRequest.getPhoneNumber());
        if(profileRequest.getDateOfBirth() != null) user.setDateOfBirth(LocalDate.parse(profileRequest.getDateOfBirth()));

        return userRepository.save(user);
    }

}
