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

    private Long product;
    private Long place;
    private BigDecimal quantity;
    private Long unit;
    private BigDecimal cost;
}
