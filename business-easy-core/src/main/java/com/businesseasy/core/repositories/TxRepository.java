package com.businesseasy.core.repositories;

import com.businesseasy.core.entities.TxEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TxRepository extends JpaRepository<TxEntity, Long> {
}
