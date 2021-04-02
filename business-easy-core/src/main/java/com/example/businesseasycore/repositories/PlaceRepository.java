package com.example.businesseasycore.repositories;

import com.example.businesseasycore.entities.PlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Long>, JpaSpecificationExecutor<PlaceEntity> {
    Optional<PlaceEntity> findById(Integer id);
    Optional<PlaceEntity> findByName(String name);
}
