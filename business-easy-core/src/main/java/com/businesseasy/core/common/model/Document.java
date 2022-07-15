package com.businesseasy.core.common.model;

import com.businesseasy.core.common.enums.DocumentType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private Long id;
    private Date date;
    private String peopleName;
    private DocumentType documentType;
    private BigDecimal total;
    private BigDecimal profit;
}
