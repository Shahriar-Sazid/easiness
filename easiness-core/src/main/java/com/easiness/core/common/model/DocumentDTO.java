package com.easiness.core.common.model;

import com.easiness.core.common.enums.DocumentType;
import com.easiness.core.entities.PeopleEntity;
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
    private Long id;
    private Date date;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PeopleEntity people;
    private DocumentType type;
    private BigDecimal total;
    private BigDecimal profit;

    List<DocumentItem> items;
}
