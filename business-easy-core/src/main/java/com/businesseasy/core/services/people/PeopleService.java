package com.businesseasy.core.services.people;

import com.businesseasy.core.common.model.People;
import com.businesseasy.core.entities.PeopleEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface PeopleService {
    Page<PeopleEntity> getPeople(Map<String, String> parameterMap);

    Integer insertPeople(People request);

    People updatePeople(People request);

    ResponseEntity<ByteArrayResource> downloadPeopleReport(Map<String, String> parameterMap);

    List<PeopleEntity> getAllCustomer();

    List<PeopleEntity> getAllSupplier();

    People getPeopleById(Integer id);
}
