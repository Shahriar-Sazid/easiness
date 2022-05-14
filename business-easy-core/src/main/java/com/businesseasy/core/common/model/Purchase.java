package com.businesseasy.core.common.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    private Date date;
    private Long supplier;
    private List<InvoiceItem> items;
    private List<Payment> payments;
}
