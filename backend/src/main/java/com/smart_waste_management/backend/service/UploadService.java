package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UploadService {
     Uploads createUpload(Long userId, UploadRequest request) throws UserNotFoundException;
     Page<Uploads> getAllUploads(Pageable pageable);
    Page<Uploads> getUploadsById(Long userId,Pageable pageable) throws UserNotFoundException;
    void deleteUpload(Long id);
}
