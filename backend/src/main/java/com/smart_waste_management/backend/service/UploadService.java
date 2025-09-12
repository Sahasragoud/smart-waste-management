package com.smart_waste_management.backend.service;

import com.smart_waste_management.backend.dto.ReUploadRequest;
import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UploadNotFoundException;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Optional;

@Service
public interface UploadService {
    public UploadResponse createUpload(UploadRequest request, MultipartFile file) throws UserNotFoundException, IOException;
    Page<UploadResponse> getUploadsByUserId(Long userId,Pageable pageable) throws UserNotFoundException;
    UploadResponse getUploadById(Long id) throws UploadNotFoundException;
    ResponseEntity<Resource> getImage(Long id) throws UploadNotFoundException, MalformedURLException;
    void deleteUpload(Long id) throws UploadNotFoundException;
    UploadResponse reUpload(Long id, ReUploadRequest reUploadRequest) throws UploadNotFoundException;
}
