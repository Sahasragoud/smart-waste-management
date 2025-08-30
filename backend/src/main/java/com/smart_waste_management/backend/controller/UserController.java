package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.UpdatePasswordRequest;
import com.smart_waste_management.backend.dto.UpdateProfileRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.AccessDeniedException;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.AuthService;
import com.smart_waste_management.backend.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService,AuthService authService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{userId}/updateProfile")
    public User updateUser(@PathVariable Long userId, @RequestBody UpdateProfileRequest profileRequest) throws UserNotFoundException{
        return userService.updateUser(userId, profileRequest);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{userId}/updatePassword")
    public User updatePassword(@PathVariable Long userId, @RequestBody UpdatePasswordRequest passwordRequest) throws UserNotFoundException, AccessDeniedException {
        return userService.updatePassword(userId, passwordRequest);
    }

}
