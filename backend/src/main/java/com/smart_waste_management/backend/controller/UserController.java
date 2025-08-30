package com.smart_waste_management.backend.controller;

import com.smart_waste_management.backend.dto.LoginRequest;
import com.smart_waste_management.backend.dto.RegisterRequest;
import com.smart_waste_management.backend.dto.UpdateProfileRequest;
import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.exception.UserNotFoundException;
import com.smart_waste_management.backend.service.AuthService;
import com.smart_waste_management.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService,AuthService authService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}/updateProfile")
    public User updateUser(@PathVariable Long userId, @RequestBody UpdateProfileRequest profileRequest) throws UserNotFoundException{
        return userService.updateUser(userId, profileRequest);
    }

}
