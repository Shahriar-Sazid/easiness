package com.businesseasy.core.common.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {

    private Product product;
    private Integer place;
    private BigDecimal quantity;
    private Integer unit;
    private BigDecimal cost;
}
