package com.easiness.core.common.model;


import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItem {

    private Long product;
    private Long place;
    private BigDecimal quantity;
    private Long unit;
    private BigDecimal cost;
}
