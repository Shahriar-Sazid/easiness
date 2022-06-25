package com.businesseasy.core.common.model;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {
    private Long stock;
    private BigDecimal quantity;
    private Long unit;
    private BigDecimal price;
}
