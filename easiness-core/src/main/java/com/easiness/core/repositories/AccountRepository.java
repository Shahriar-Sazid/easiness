package com.easiness.core.repositories;

import com.easiness.core.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Integer>, JpaSpecificationExecutor<AccountEntity> {
    Optional<AccountEntity> findByAccountNo(String accountNo);
    Optional<AccountEntity> findById(Long id);
    Optional<AccountEntity> findByAccountName(String accountName);
    List<AccountEntity> findByIdIn(List<Long> idList);
}
