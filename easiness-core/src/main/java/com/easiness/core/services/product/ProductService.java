package com.easiness.core.services.product;

import com.easiness.core.common.model.ProductCreationRequest;
import com.easiness.core.common.model.Product;
import com.easiness.core.entities.ProductEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ProductService {
    Page<ProductEntity> getAllProduct(Map<String, String> parameterMap);

    List<Long> createProduct(ProductCreationRequest request);

    ProductEntity updateProduct(Product request);

    ResponseEntity<ByteArrayResource> downloadProductReport(Map<String, String> parameterMap);
}
