package com.example.businesseasycore.entities;

import com.example.businesseasycore.common.enums.PeopleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "people", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "company_name"})})
public class PeopleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Integer id;

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
    Double balance;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    List<ContactNoEntity> contactNoList;
}
