package com.easiness.core.common.model;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoveProductData {
    private Long stockId;
    private BigDecimal quantity;
    private Long unit;
    private Long toPlace;
}
