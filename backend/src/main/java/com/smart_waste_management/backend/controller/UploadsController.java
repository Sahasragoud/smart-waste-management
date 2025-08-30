package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.UploadService;
import jakarta.annotation.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

@RestController
@RequestMapping("api/uploads")
public class UploadsController {

    private final UploadService uploadService;


    public UploadsController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/user/{userId}")
    public UploadResponse createUpload(@PathVariable Long userId,
                                       @RequestParam("file") MultipartFile file
    ) throws UserNotFoundException, IOException {
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String filePath = uploadDir + System.currentTimeMillis() +"_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);

        UploadRequest request = new UploadRequest();
        request.setFileName(file.getOriginalFilename());
        request.setFileType(file.getContentType());
        request.setFileSize(String.valueOf(file.getSize()));
        request.setFilePath(filePath);

        return uploadService.createUpload(userId, request);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{userId}")
    public Page<Uploads> getAllByUserId(
            @PathVariable Long userId,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam String sortDirection
    ) throws UserNotFoundException {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sortBy = Sort.by(direction, sortField);
        return uploadService.getUploadsById(userId,PageRequest.of(page,size,sortBy));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<org.springframework.core.io.Resource> getImage(@PathVariable Long id) throws IOException {
        // Fetch upload entity
        Uploads upload = uploadService.getUploadById(id)
                .orElseThrow(() -> new RuntimeException("Upload not found with id: " + id));

        // Build path from DB
        Path path = Paths.get(upload.getFilePath());
        org.springframework.core.io.Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("File not found on disk: " + upload.getFilePath());
        }

        // Detect media type dynamically
        MediaType mediaType = MediaType.parseMediaType(upload.getFileType());

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}
