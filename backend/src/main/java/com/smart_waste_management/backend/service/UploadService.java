package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UploadService {
     UploadResponse createUpload(Long userId, UploadRequest request) throws UserNotFoundException;
    Page<Uploads> getUploadsById(Long userId,Pageable pageable) throws UserNotFoundException;
    Optional<Uploads> getUploadById(Long id);
}
