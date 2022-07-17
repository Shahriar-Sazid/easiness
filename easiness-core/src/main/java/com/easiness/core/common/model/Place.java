package com.easiness.core.common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Place {
    Long id;

    @NotNull(message = "Place name must not be null")
    @NotBlank(message = "Place name must not be blank")
    String name;

    String address;
}
