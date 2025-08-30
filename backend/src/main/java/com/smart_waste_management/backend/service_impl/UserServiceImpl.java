package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.dto.UpdatePasswordRequest;
import com.smart_waste_management.backend.dto.UpdateProfileRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.AccessDeniedException;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    @Override
    public User updatePassword(Long userId, UpdatePasswordRequest request) throws UserNotFoundException, AccessDeniedException {
        User user = userRepository.findByEmail(request.getEmail());
        if(user == null) {
            throw new UserNotFoundException("User not found by email, " + request.getEmail());
        }
        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new AccessDeniedException("Wrong password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userRepository.save(user);
    }

}
