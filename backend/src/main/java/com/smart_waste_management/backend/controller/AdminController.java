package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    @GetMapping
    public Page<User> getAllUsers(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam String sortDirection
    ){
        Sort sortBy = Sort.by(sortDirection,sortField);
        return adminService.getAllUsers(PageRequest.of(page,size,sortBy));
    }
}
