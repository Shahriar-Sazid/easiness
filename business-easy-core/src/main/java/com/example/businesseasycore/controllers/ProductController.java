package com.example.businesseasycore.controllers;

import com.example.businesseasycore.common.model.ProductCreationRequest;
import com.example.businesseasycore.common.model.ProductUpdateRequest;
import com.example.businesseasycore.entities.ProductEntity;
import com.example.businesseasycore.services.product.ProductService;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    ProductService productService;

    @GetMapping("")
    Page<ProductEntity> getAllProduct(@RequestParam Map<String, String> parameterMap) {

        return productService.getAllProduct(parameterMap);
    }

    @PostMapping("")
    List<Integer> createProduct(@Valid @RequestBody ProductCreationRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("")
    ProductEntity updateProduct(@Valid @RequestBody ProductUpdateRequest request) {
        return productService.updateProduct(request);
    }

    @RequestMapping(value = "/report", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE, method = RequestMethod.GET)
    public ResponseEntity<ByteArrayResource> downloadProductReport(@RequestParam Map<String, String> parameterMap) throws FileNotFoundException, JRException {
        return productService.downloadProductReport(parameterMap);
    }

}
