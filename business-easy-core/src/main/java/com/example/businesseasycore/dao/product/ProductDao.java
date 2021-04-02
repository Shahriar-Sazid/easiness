package com.example.businesseasycore.dao.product;


import com.example.businesseasycore.common.model.ProductCreationRequest;
import com.example.businesseasycore.entities.ProductEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ProductDao {
    Page<ProductEntity> getAllProduct(Map<String, String> parameterMap);

    List<Integer> createProduct(ProductCreationRequest request);

    ProductEntity updateProduct(ProductEntity request);
}
