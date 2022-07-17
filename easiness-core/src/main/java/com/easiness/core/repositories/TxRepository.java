package com.easiness.core.repositories;

import com.easiness.core.entities.TxEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TxRepository extends JpaRepository<TxEntity, Long> {
}
