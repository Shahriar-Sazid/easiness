package com.easiness.core.repositories;

import com.easiness.core.entities.PeopleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PeopleRepository extends JpaRepository<PeopleEntity, Long>, JpaSpecificationExecutor<PeopleEntity> {
    Optional<PeopleEntity> findById(Long id);

    @Query(value = "SELECT p FROM PeopleEntity p JOIN FETCH p.contactNoList c " +
            " where p.type in ('BOTH', 'SUPPLIER')")
    List<PeopleEntity> findAllSupplier();


    @Query(value = "SELECT p FROM PeopleEntity p JOIN FETCH p.contactNoList c " +
            " where p.type in ('BOTH', 'CUSTOMER')")
    List<PeopleEntity> findAllCustomer();
}
