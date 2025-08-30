package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.AuthResponse;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.entity.Uploads;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<AuthResponse> createAdmin(@RequestBody RegisterRequest request){
        User admin = adminService.createAdmin(request);
        AuthResponse response = new AuthResponse(
                admin.getId(),admin.getUsername(), admin.getEmail(), admin.getRole().toString()
        );
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public Page<User> getAllUsers(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam String sortDirection
    ){
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sortBy = Sort.by(direction,sortField);
        return adminService.getAllUsers(PageRequest.of(page,size,sortBy));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("user/{userId}")
    public void deleteUser(@PathVariable Long userId) throws UserNotFoundException {
        adminService.deleteUser(userId);
    }

    @GetMapping("/uploads")
    public Page<Uploads> getAllUploads(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam String sortDirection
    ){
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sortBy = Sort.by(direction, sortField);
        return adminService.getAllUploads(PageRequest.of(page,size,sortBy));
    }
    
}
