package com.example.businesseasycore.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contact_no", uniqueConstraints = {@UniqueConstraint(columnNames = "contact_no")})
public class ContactNoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Integer id;

    @Column(name = "contact_no", nullable = false)
    String contactNo;

    @Column(name = "owner_id")
    Integer ownerId;
}
