package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


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

    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) throws UserNotFoundException {
        adminService.deleteUser(userId);
    }

}
