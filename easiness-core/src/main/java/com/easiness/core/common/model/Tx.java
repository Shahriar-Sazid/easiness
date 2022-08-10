package com.easiness.core.common.model;

import com.easiness.core.common.enums.TxType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tx {
    private Long id;
    private BigDecimal amount;
    private Long fromAccountId;
    private Long toAccountId;
    private Long peopleId;
    private String peopleName;
    private Long documentId;
    private String ref;
    private TxType type;
    private String meta;
    private String purpose;
    private Date date;
}
