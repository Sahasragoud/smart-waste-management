package com.smart_waste_management.backend.service_impl;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UploadNotFoundException;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.repository.UploadsRepository;
import com.smart_waste_management.backend.repository.UserRepository;
import com.smart_waste_management.backend.service.UploadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
public class UploadsServiceImpl implements UploadService {

    private final UploadsRepository uploadsRepository;
    private final UserRepository userRepository;

    public UploadsServiceImpl(UploadsRepository uploadsRepository, UserRepository userRepository) {
        this.uploadsRepository = uploadsRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UploadResponse createUpload(Long userId, UploadRequest request) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User Not found with id" + userId));
        Uploads upload = new Uploads();
        upload.setUser(user);
        upload.setFileName(request.getFileName());
        upload.setFileType(request.getFileType());
        upload.setFilePath(request.getFilePath());
        upload.setFileSize(Long.valueOf(request.getFileSize()));
        uploadsRepository.save(upload);

        return new UploadResponse(upload.getFileName(), upload.getFileType(),  upload.getFileSize(),upload.getFilePath(), userId);
    }

    @Override
    public Page<Uploads> getUploadsByUserId(Long userId, Pageable pageable) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User Not found with id" + userId));
        return uploadsRepository.findAllByUserId(userId,pageable);
    }

    @Override
    public Optional<Uploads> getUploadById(Long id) {
        return uploadsRepository.findById(id);
    }

    @Override
    public ResponseEntity<Resource> getImage(Long id) throws UploadNotFoundException, MalformedURLException {
        Uploads upload = uploadsRepository.findById(id)
                .orElseThrow(() -> new UploadNotFoundException("Upload not found with id : " + id));

        Path path = Paths.get(upload.getFilePath());
        Resource resource = (Resource) new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("File not found on disk: " + upload.getFilePath());
        }

        MediaType mediaType = MediaType.parseMediaType(upload.getFileType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);

    }
}
