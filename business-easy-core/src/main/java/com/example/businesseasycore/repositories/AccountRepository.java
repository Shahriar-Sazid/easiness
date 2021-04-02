package com.example.businesseasycore.repositories;

import com.example.businesseasycore.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long>, JpaSpecificationExecutor<AccountEntity> {
    Optional<AccountEntity> findByAccountNo(String accountNo);
    Optional<AccountEntity> findById(Integer id);
    Optional<AccountEntity> findByAccountName(String accountName);
}
