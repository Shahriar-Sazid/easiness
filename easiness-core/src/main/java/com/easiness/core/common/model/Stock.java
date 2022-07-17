package com.easiness.core.common.model;

import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
    Long id;
    String name;
    String type;
    String brand;
    String country;
    String size;
    String placeTxt;
    Long place;
    BigDecimal cost;
    BigDecimal quantity;
    String unitTxt;
    Long unit;
}
