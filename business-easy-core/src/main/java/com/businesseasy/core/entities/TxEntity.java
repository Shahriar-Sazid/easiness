package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.TxType;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tx")
public class TxEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "amount")
    BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id")
    AccountEntity fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    AccountEntity toAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "people_id")
    PeopleEntity peopleEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    DocumentEntity documentEntity;

    @Column(name = "ref")
    String ref;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    TxType type;

    @Column(name = "meta")
    String meta;
}
