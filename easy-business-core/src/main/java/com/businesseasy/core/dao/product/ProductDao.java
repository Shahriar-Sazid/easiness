package com.businesseasy.core.dao.product;


import com.businesseasy.core.common.model.ProductCreationRequest;
import com.businesseasy.core.entities.ProductEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ProductDao {
    Page<ProductEntity> getAllProduct(Map<String, String> parameterMap);

    List<Integer> createProduct(ProductCreationRequest request);

    ProductEntity updateProduct(ProductEntity request);
}
