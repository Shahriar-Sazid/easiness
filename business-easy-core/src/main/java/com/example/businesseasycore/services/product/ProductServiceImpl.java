package com.example.businesseasycore.services.product;

import com.example.businesseasycore.common.model.ProductCreationRequest;
import com.example.businesseasycore.common.model.ProductUpdateRequest;
import com.example.businesseasycore.dao.product.ProductDao;
import com.example.businesseasycore.entities.ProductEntity;
import com.example.businesseasycore.services.report.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    ProductDao productDao;

    @Autowired
    ReportService reportService;

    @Override
    public Page<ProductEntity> getAllProduct(Map<String, String> parameterMap) {
        return productDao.getAllProduct(parameterMap);
    }

    @Override
    public List<Integer> createProduct(ProductCreationRequest request) {
        return productDao.createProduct(request);
    }

    @Override
    public ProductEntity updateProduct(ProductUpdateRequest request) {
        ProductEntity entity = ProductEntity.builder()
                .id(request.getId())
                .name(request.getName())
                .type(request.getType())
                .brand(request.getBrand())
                .country(request.getCountry())
                .size(request.getSize())
                .build();
        return productDao.updateProduct(entity);
    }

    @Override
    public ResponseEntity<ByteArrayResource> downloadProductReport(Map<String, String> parameterMap) {
        Page<ProductEntity> productEntityPage = getAllProduct(parameterMap);
        List<ProductEntity> productEntityList = productEntityPage.getContent();
        return reportService.createProductReport(productEntityList,
                Optional.ofNullable(parameterMap.get("activeFilters")).orElse("<NO FILTER>"));
    }
}
