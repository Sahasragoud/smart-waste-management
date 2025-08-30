package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.dto.UpdateProfileRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    public User updateUser(Long userId, UpdateProfileRequest profileRequest) throws UserNotFoundException;
}
