package com.example.businesseasycore.services.people;

import com.example.businesseasycore.common.model.People;
import com.example.businesseasycore.dao.people.PeopleDao;
import com.example.businesseasycore.entities.PeopleEntity;
import com.example.businesseasycore.services.report.ReportService;
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

    @Override
    public List<PeopleEntity> getAllCustomer() {
        return peopleDao.getAllCustomer();
    }

    @Override
    public List<PeopleEntity> getAllSupplier() {
        return peopleDao.getAllSupplier();
    }
}
