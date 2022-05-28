package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockRepository extends JpaRepository<StockEntity, Long> {
    List<StockEntity> findByProduct_IdIn(List<Long> productId);
}
