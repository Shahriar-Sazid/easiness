package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.PlaceEntity;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Long>, JpaSpecificationExecutor<PlaceEntity> {
    @NotNull Optional<PlaceEntity> findById(@NotNull Long id);
    Optional<PlaceEntity> findByName(String name);
}
