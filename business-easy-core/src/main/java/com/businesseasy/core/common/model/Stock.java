package com.businesseasy.core.common.model;

import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
    String name;
    String type;
    String brand;
    String country;
    String size;
    String place;
    BigDecimal cost;
    BigDecimal quantity;
    String unit;
}
