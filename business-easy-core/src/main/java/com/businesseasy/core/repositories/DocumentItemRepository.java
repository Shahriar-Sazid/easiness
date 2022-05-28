package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.ContactNoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentItemRepository extends JpaRepository<ContactNoEntity, Long> {
}
