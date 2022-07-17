package com.easiness.core.common.model;


import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {
    private Date date;
    private Long supplier;
    private List<PurchaseOrderItem> items;
    private List<Payment> payments;
}
