package com.businesseasy.core.common.model;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ProductCreationRequest {
    @NotNull(message = "Product name must not be null")
    @NotBlank(message = "Product name must not be blank")
    private String name;

    private String type;

    private String brand;

    @NotNull(message = "Country name must not be null")
    @NotBlank(message = "Country name must not be blank")
    private String country;

    private List<String> sizes;
}
