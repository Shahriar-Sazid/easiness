package com.easiness.core.repositories;

import com.easiness.core.entities.ContactNoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactNoRepository extends JpaRepository<ContactNoEntity, Long> {
    Optional<ContactNoEntity> findByContactNo(String contactNo);
    List<ContactNoEntity> findAllByOwnerId(Long ownerId);
}
