package com.easiness.core.common.model;

import lombok.*;

import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTx {
    List<Payment> payments;
    Long peopleId;
    Long docId;
    String ref;
    String meta;
    String purpose;
}
