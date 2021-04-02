package com.example.businesseasycore.dao.people;

import com.example.businesseasycore.common.model.People;
import com.example.businesseasycore.entities.PeopleEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PeopleDao {
    Page<PeopleEntity> getPeople(Map<String, String> parameterMap);

    Integer insertPeople(People request);

    People updatePeople(People request);
}
