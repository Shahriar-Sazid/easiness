package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<StockEntity, Integer> {
}
