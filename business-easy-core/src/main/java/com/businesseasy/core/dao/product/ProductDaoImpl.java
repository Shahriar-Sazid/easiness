package com.businesseasy.core.dao.product;

import com.businesseasy.core.common.SearchOperation;
import com.businesseasy.core.common.model.ProductCreationRequest;
import com.businesseasy.core.exception_handler.ReasonCode;
import com.businesseasy.core.common.SearchCriteria;
import com.businesseasy.core.entities.ProductEntity;
import com.businesseasy.core.exception_handler.UniqueConstraintsViolationException;
import com.businesseasy.core.repositories.ProductRepository;
import com.businesseasy.core.specification.EntitySpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ProductDaoImpl implements ProductDao {
    @Autowired
    ProductRepository productRepository;


    @Override
    public Page<ProductEntity> getAllProduct(Map<String, String> parameterMap) {
        EntitySpecification<ProductEntity> entitySpecification = new EntitySpecification<>();
        entitySpecification.add(new SearchCriteria("name", parameterMap.get("name"), SearchOperation.MATCH));
        entitySpecification.add(new SearchCriteria("type", parameterMap.get("type"), SearchOperation.MATCH));
        entitySpecification.add(new SearchCriteria("brand", parameterMap.get("brand"), SearchOperation.MATCH));
        int page = parameterMap.containsKey("page")? Integer.parseInt(parameterMap.get("page")) - 1: 0;
        int pageSize = parameterMap.containsKey("pageSize")? Integer.parseInt(parameterMap.get("pageSize")): 10;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("name", "id"));

        return productRepository.findAll(entitySpecification, pageable);
    }

    @Override
    public List<Integer> createProduct(ProductCreationRequest request) {
        List<ProductEntity> entityList = new ArrayList<>();
        if (request.getSizes() == null || request.getSizes().size() == 0) {
            ProductEntity entity = new ProductEntity();
            entity.setName(request.getName());
            entity.setType(request.getType());
            entity.setBrand(request.getBrand());
            entity.setCountry(request.getCountry());
            entityList.add(entity);
        } else {
            for (int i = 0; i < request.getSizes().size(); i++) {
                ProductEntity entity = new ProductEntity();
                entity.setName(request.getName());
                entity.setType(request.getType());
                entity.setBrand(request.getBrand());
                entity.setCountry(request.getCountry());
                entity.setSize(request.getSizes().get(i));
                entityList.add(entity);
            }
        }
        List<ProductEntity> newProducts;
        try {
            newProducts = productRepository.saveAll(entityList);
        } catch (DataIntegrityViolationException e) {
            throw new UniqueConstraintsViolationException(ReasonCode.PRODUCT_ALREADY_EXISTING.getMessage());
        }
        return newProducts.stream().map(ProductEntity::getId).collect(Collectors.toList());
    }

    @Override
    public ProductEntity updateProduct(ProductEntity entity) {
        ProductEntity updatedEntity;
        try {
            updatedEntity = productRepository.save(entity);
        } catch (DataIntegrityViolationException e) {
            throw new UniqueConstraintsViolationException(ReasonCode.DUPLICATE_PRODUCT_FOUND.getMessage());
        }
        return updatedEntity;
    }
}
