package com.example.businesseasycore.common.model;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ProductUpdateRequest {
    @NotNull(message = "Product Id must not be null")
    private Integer id;

    @NotNull(message = "Product name must not be null")
    @NotBlank(message = "Product name must not be blank")
    private String name;

    private String type;

    private String brand;

    @NotNull(message = "Country name must not be null")
    @NotBlank(message = "Country name must not be blank")
    private String country;

    private String size;
}
