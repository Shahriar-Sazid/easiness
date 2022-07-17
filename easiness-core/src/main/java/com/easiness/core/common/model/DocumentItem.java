package com.easiness.core.common.model;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentItem {
    private String name;
    private String type;
    private String brand;
    private String country;
    private String size;
    private BigDecimal costOrPrice;
    private BigDecimal quantity;
    private Long unit;
    private Long place;
}
