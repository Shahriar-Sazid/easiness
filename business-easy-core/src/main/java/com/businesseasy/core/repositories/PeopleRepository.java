package com.businesseasy.core.repositories;

import com.businesseasy.core.common.enums.PeopleType;
import com.businesseasy.core.common.model.PeoplePojo;
import com.businesseasy.core.entities.PeopleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PeopleRepository extends JpaRepository<PeopleEntity, Integer>, JpaSpecificationExecutor<PeopleEntity> {
    PeopleEntity findByName(String name);
    Optional<PeopleEntity> findById(Integer id);

    List<PeopleEntity> findByTypeNotIn(List<PeopleType> typeList);

    @Query(value = "SELECT new com.businesseasy.core.common.model.PeoplePojo( " +
            " p.id, p.name, p.companyName, " +
            " p.address, p.email, p.type, p.balance, cn.contactNo, cn.id) " +
            " from PeopleEntity p inner join ContactNoEntity cn on p.id = cn.ownerId " +
            " where p.type in ('BOTH', 'CUSTOMER')")
    List<PeoplePojo> findAllCustomer();
}
