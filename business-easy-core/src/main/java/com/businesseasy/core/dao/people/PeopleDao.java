package com.businesseasy.core.dao.people;

import com.businesseasy.core.common.model.People;
import com.businesseasy.core.entities.PeopleEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface PeopleDao {
    Page<PeopleEntity> getPeople(Map<String, String> parameterMap);

    Integer insertPeople(People request);

    People updatePeople(People request);

    List<PeopleEntity> getAllCustomer();

    List<PeopleEntity> getAllSupplier();
}
