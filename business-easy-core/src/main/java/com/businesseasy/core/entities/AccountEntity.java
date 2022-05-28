package com.businesseasy.core.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account", uniqueConstraints = {@UniqueConstraint(columnNames = {"bank", "account_no"})})
public class AccountEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    Long id;

    @Column(name = "account_name")
    String accountName;

    @Column(name = "holder_name")
    String holderName;

    @Column(name = "bank")
    String bank;

    @Column(name = "branch")
    String branch;

    @Column(name = "account_no")
    String accountNo;

    @Column(name = "balance")
    BigDecimal balance;
}
