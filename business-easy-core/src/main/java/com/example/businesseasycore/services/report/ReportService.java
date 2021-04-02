package com.example.businesseasycore.services.report;

import com.example.businesseasycore.common.model.People;
import com.example.businesseasycore.entities.AccountEntity;
import com.example.businesseasycore.entities.ProductEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReportService {
    ResponseEntity<ByteArrayResource> createProductReport(List<ProductEntity> productList, String activeFilters);

    ResponseEntity<ByteArrayResource> createPeopleReport(List<People> peopleList, String activeFilters);

    ResponseEntity<ByteArrayResource> createAccountReport(List<AccountEntity> accountEntityList, String activeFilters);
}
