package com.easiness.core.services.report;

import com.easiness.core.common.model.People;
import com.easiness.core.entities.ProductEntity;
import com.easiness.core.entities.AccountEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReportService {
    ResponseEntity<ByteArrayResource> createProductReport(List<ProductEntity> productList, String activeFilters);

    ResponseEntity<ByteArrayResource> createPeopleReport(List<People> peopleList, String activeFilters);

    ResponseEntity<ByteArrayResource> createAccountReport(List<AccountEntity> accountEntityList, String activeFilters);
}
