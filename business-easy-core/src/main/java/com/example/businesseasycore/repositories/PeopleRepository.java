package com.example.businesseasycore.repositories;

import com.example.businesseasycore.entities.PeopleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PeopleRepository extends JpaRepository<PeopleEntity, Long>, JpaSpecificationExecutor<PeopleEntity> {
    PeopleEntity findByName(String name);
    PeopleEntity findById(Integer id);
}
