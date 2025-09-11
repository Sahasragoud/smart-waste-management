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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
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
    public UploadResponse createUpload(UploadRequest request, MultipartFile file) throws UserNotFoundException, IOException {
        //  Find user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + request.getUserId()));

        //  Save file physically
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get("uploads/"); // you can use application.properties
        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Mock AI prediction
        String category = "plastic"; // mock category
        Double confidence = 0.92;    // mock confidence

        // Save Upload entity
        Uploads upload = new Uploads();
        upload.setUser(user);
        upload.setFileName(fileName);
        upload.setFileType(file.getContentType());
        upload.setFileSize(file.getSize());
        upload.setFilePath(filePath.toString());
        upload.setCategory(category);
        upload.setConfidence(confidence);

        uploadsRepository.save(upload);

        //  Prepare UploadResponse with guidance
        return new UploadResponse(
                upload.getId(),
                upload.getFileName(),
                upload.getFileType(),
                upload.getFileSize(),
                upload.getFilePath(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                category,
                confidence,
                getGuidance(category),
                upload.getCreatedAt().toString()
        );
    }

    // Optional guidance method
    private String getGuidance(String category) {
        switch (category.toLowerCase()) {
            case "plastic": return "Dispose in yellow bin.";
            case "paper": return "Place in blue bin.";
            case "organic": return "Use green bin or compost.";
            default: return "Dispose responsibly.";
        }
    }

    @Override
    public Page<UploadResponse> getUploadsByUserId(Long userId, Pageable pageable) throws UserNotFoundException {
        // 1️⃣ Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        // 2️⃣ Get uploads from DB
        Page<Uploads> uploadsPage = uploadsRepository.findAllByUserId(userId, pageable);

        // 3️⃣ Map Uploads entity to UploadResponse DTO
        return uploadsPage.map(upload -> new UploadResponse(
                upload.getId(),
                upload.getFileName(),
                upload.getFileType(),
                upload.getFileSize(),
                upload.getFilePath(),
                userId,
                user.getUsername(),
                user.getEmail(),
                upload.getCategory(),       // can be null initially
                upload.getConfidence(),     // can be null initially
                null,
                upload.getCreatedAt().toString()
        ));
    }


    @Override
    public UploadResponse getUploadById(Long id) throws UploadNotFoundException {
        Uploads upload = uploadsRepository.findById(id)
                .orElseThrow(() -> new UploadNotFoundException("Upload not found with id: " + id));

        return new UploadResponse(
                upload.getId(),
                upload.getFileName(),
                upload.getFileType(),
                upload.getFileSize(),
                upload.getFilePath(),
                upload.getUser().getId(),
                upload.getUser().getUsername(),
                upload.getUser().getEmail(),
                upload.getCategory(),
                upload.getConfidence(),
                null, // guidance can be set later
                upload.getCreatedAt().toString()
        );
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


    @Override
    public void deleteUpload(Long id) throws UploadNotFoundException {
        Uploads upload = uploadsRepository.findById(id).orElseThrow(
                () -> new UploadNotFoundException("Upload is not available")
        );
        uploadsRepository.deleteById(id);
    }
}
