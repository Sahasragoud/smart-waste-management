package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
}
