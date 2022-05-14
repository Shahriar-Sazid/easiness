package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.PlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Integer>, JpaSpecificationExecutor<PlaceEntity> {
    Optional<PlaceEntity> findById(Long id);
    Optional<PlaceEntity> findByName(String name);
}
