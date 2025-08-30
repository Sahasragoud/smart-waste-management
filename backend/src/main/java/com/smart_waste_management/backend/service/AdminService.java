package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface AdminService {
    public Page<User> getAllUsers(Pageable pageable);
    public void deleteUser(Long userId) throws UserNotFoundException;

}
