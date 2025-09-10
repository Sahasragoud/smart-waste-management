package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.dto.UploadResponse;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.UploadService;
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

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:5173")
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

        // 1️⃣ Prepare upload directory
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2️⃣ Save file physically
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 3️⃣ Prepare UploadRequest (just to carry userId and file info if needed)
        UploadRequest request = new UploadRequest();
        request.setUserId(userId);
        request.setFileName(fileName);
        request.setFileType(file.getContentType());


        // 4️⃣ Call service with request + MultipartFile
        return uploadService.createUpload(request, file);
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
        return uploadService.getUploadsByUserId(userId,PageRequest.of(page,size,sortBy));
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
