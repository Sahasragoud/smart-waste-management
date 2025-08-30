package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceIMpl implements AdminService {
    private final UserRepository userRepository;


    public AdminServiceIMpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public void deleteUser(Long userId) throws UserNotFoundException {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()){
            throw new UserNotFoundException("User not found by id, " + userId );
        }
        userRepository.deleteById(userId);
    }
}
