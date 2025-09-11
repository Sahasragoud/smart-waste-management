package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface AdminService {
    public void deleteUser(Long userId) throws UserNotFoundException;
    public User createAdmin(RegisterRequest request);
    Page<UploadResponse> getAllUploads(Pageable pageable);
    public Page<User> getUsersByRole(Role role, Pageable pageable);
}
