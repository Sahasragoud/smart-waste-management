package com.smart_waste_management.backend.repository;

import com.smart_waste_management.backend.entity.User;
import com.smart_waste_management.backend.enums.Role;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Page<User> findAll(Pageable pageable);
    User findByEmail(String email);
    Page<User> findByRole(Role role, Pageable pageable);

 }
