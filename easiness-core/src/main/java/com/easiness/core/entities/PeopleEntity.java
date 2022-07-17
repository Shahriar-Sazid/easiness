package com.easiness.core.entities;

import com.easiness.core.common.enums.PeopleType;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "people", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "company_name"})})
public class PeopleEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "name")
    String name;

    @Column(name = "company_name")
    String companyName;

    @Column(name = "address")
    String address;

    @Column(name = "email")
    String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    PeopleType type;

    @Column(name = "balance")
    BigDecimal balance;

    @OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL }, orphanRemoval = true)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    List<ContactNoEntity> contactNoList;
}
