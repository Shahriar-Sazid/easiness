package com.businesseasy.core.services.people;

import com.businesseasy.core.common.model.PeoplePojo;
import com.businesseasy.core.entities.ContactNoEntity;
import com.businesseasy.core.entities.PeopleEntity;
import com.businesseasy.core.common.model.People;
import com.businesseasy.core.dao.people.PeopleDao;
import com.businesseasy.core.services.report.ReportService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PeopleServiceImpl implements PeopleService {
    @Autowired
    PeopleDao peopleDao;

    @Autowired
    ReportService reportService;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public Page<PeopleEntity> getPeople(Map<String, String> parameterMap) {
        return peopleDao.getPeople(parameterMap);
    }

    @Override
    public Integer insertPeople(People request) {
        return peopleDao.insertPeople(request);
    }

    @Override
    public People updatePeople(People request) {
        return peopleDao.updatePeople(request);
    }

    @Override
    public ResponseEntity<ByteArrayResource> downloadPeopleReport(Map<String, String> parameterMap) {
        Page<PeopleEntity> peopleEntityPage = getPeople(parameterMap);
        List<PeopleEntity> peopleEntityList = peopleEntityPage.getContent();
        List<People> peopleList = new ArrayList<>();
        for (PeopleEntity entity : peopleEntityList) {
            peopleList.add(
                    People.builder()
                            .name(entity.getName())
                            .companyName(entity.getCompanyName())
                            .address(entity.getAddress())
                            .typeStr(entity.getType().name())
                            .balance(entity.getBalance())
                            .email(entity.getEmail())
                            .contactNoStr(entity
                                    .getContactNoList()
                                    .stream()
                                    .reduce("", (el1, el2) -> {
                                        if (!"".equals(el1)) {
                                            return el1.concat(",\n").concat(el2.getContactNo());
                                        } else {
                                            return el2.getContactNo();
                                        }
                                    }, String::concat)
                            )
                            .build()
            );
        }
        return reportService.createPeopleReport(peopleList,
                Optional.ofNullable(parameterMap.get("activeFilters")).orElse("<NO FILTER>"));
    }

    PeopleEntity toPeopleEntity(PeoplePojo peoplePojo) {
        PeopleEntity peopleEntity =  modelMapper.typeMap(PeoplePojo.class, PeopleEntity.class)
                .map(peoplePojo);

        ContactNoEntity contactNoEntity = ContactNoEntity.builder()
                .contactNo(peoplePojo.getContactNo())
                .ownerId(peoplePojo.getId())
                .id(peoplePojo.getContactNoId())
                .build();

        List<ContactNoEntity> contactNoEntityList = new ArrayList<>();
        contactNoEntityList.add(contactNoEntity);

        peopleEntity.setContactNoList(contactNoEntityList);

        return peopleEntity;
    }

    @Override
    public List<PeopleEntity> getAllCustomer() {
        return peopleDao.getAllCustomer();
    }

    @Override
    public List<PeopleEntity> getAllSupplier() {
        return peopleDao.getAllSupplier();
    }
}
