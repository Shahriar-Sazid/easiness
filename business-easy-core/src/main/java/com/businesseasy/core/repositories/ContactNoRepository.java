package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.ContactNoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactNoRepository extends JpaRepository<ContactNoEntity, Integer> {
    Optional<ContactNoEntity> findByContactNo(String contactNo);
    List<ContactNoEntity> findAllByOwnerId(Integer ownerId);
}
