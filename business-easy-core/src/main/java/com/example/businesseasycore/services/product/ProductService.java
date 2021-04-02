package com.example.businesseasycore.services.product;

import com.example.businesseasycore.common.model.ProductCreationRequest;
import com.example.businesseasycore.common.model.ProductUpdateRequest;
import com.example.businesseasycore.entities.ProductEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ProductService {
    Page<ProductEntity> getAllProduct(Map<String, String> parameterMap);

    List<Integer> createProduct(ProductCreationRequest request);

    ProductEntity updateProduct(ProductUpdateRequest request);

    ResponseEntity<ByteArrayResource> downloadProductReport(Map<String, String> parameterMap);
}
