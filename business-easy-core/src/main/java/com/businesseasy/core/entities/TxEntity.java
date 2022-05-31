package com.businesseasy.core.entities;

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
    @JoinColumn(name = "account_id")
    AccountEntity accountEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "people_id")
    PeopleEntity peopleEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    DocumentEntity documentEntity;

    @Column(name = "meta")
    String meta;
}
