package com.smart_waste_management.backend.repository;

import com.smart_waste_management.backend.entity.Uploads;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadsRepository extends JpaRepository<Uploads, Long> {
    Page<Uploads> findAllByUserId(Long userId, Pageable pageable);
    Page<Uploads> findAll(Pageable pageable);

}
