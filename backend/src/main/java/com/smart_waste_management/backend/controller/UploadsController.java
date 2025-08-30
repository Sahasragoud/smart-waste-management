package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.UploadRequest;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.UploadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("api/uploads")
public class UploadsController {

    private final UploadService uploadService;


    public UploadsController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/user/{userId}")
    public Uploads createUpload(@PathVariable Long userId, @RequestBody UploadRequest request) throws UserNotFoundException {
        return uploadService.createUpload(userId,request);
    }

    @GetMapping
    public Page<Uploads> getAllUploads(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam String sortDirection
    ){
        Sort sortBy = Sort.by(sortDirection, sortField);
        return uploadService.getAllUploads(PageRequest.of(page,size,sortBy));
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
        Sort sortBy = Sort.by(sortDirection, sortField);
        return uploadService.getUploadsById(userId,PageRequest.of(page,size,sortBy));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUpload(@PathVariable Long id){
        uploadService.deleteUpload(id);
    }
}
