package com.businesseasy.core.common.model;

import com.businesseasy.core.common.enums.DocumentType;
import com.businesseasy.core.entities.PeopleEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Date date;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PeopleEntity people;
    private DocumentType type;
    private BigDecimal total;
    private BigDecimal profit;

    List<DocumentItem> items;
}
