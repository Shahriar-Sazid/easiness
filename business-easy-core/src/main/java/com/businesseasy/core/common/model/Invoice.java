package com.businesseasy.core.common.model;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    private Date date;
    private Long customer;
    private List<InvoiceItem> items;
    private List<Payment> payments;
}
