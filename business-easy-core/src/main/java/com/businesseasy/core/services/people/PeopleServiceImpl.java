package com.businesseasy.core.services.people;

import com.businesseasy.core.common.model.People;
import com.businesseasy.core.dao.people.PeopleDao;
import com.businesseasy.core.entities.ContactNoEntity;
import com.businesseasy.core.entities.PeopleEntity;
import com.businesseasy.core.services.report.ReportService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public Long insertPeople(People request) {
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
            peopleList.add(toPeople(entity));
        }
        return reportService.createPeopleReport(peopleList,
                Optional.ofNullable(parameterMap.get("activeFilters")).orElse("<NO FILTER>"));
    }

    @Override
    public List<PeopleEntity> getAllCustomer() {
        return peopleDao.getAllCustomer();
    }

    @Override
    public List<PeopleEntity> getAllSupplier() {
        return peopleDao.getAllSupplier();
    }

    private People toPeople(PeopleEntity peopleEntity) {
        return People.builder()
                .name(peopleEntity.getName())
                .companyName(peopleEntity.getCompanyName())
                .address(peopleEntity.getAddress())
                .typeStr(peopleEntity.getType().name())
                .type(peopleEntity.getType())
                .balance(peopleEntity.getBalance())
                .email(peopleEntity.getEmail())
                .contactNumber(toContactStr(peopleEntity.getContactNoList()))
                .build();
    }

    private String toContactStr(List<ContactNoEntity> contactNoEntityList) {
        return contactNoEntityList.stream()
                .reduce("", (el1, el2) -> {
                    if (!"".equals(el1)) {
                        return el1.concat(",\n").concat(el2.getContactNo());
                    } else {
                        return el2.getContactNo();
                    }
                }, String::concat);
    }

    @Override
    public People getPeopleById(Integer id) {
        Optional<PeopleEntity> peopleEntity = peopleDao.getPeopleById(id);
        return peopleEntity.map(this::toPeople).orElse(null);
    }
}
