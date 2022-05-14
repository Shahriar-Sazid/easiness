package com.businesseasy.core.entities;

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
@Table(name = "contact_no")
public class ContactNoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "contact_no", nullable = false, unique = true)
    String contactNo;

    @Column(name = "owner_id")
    Long ownerId;
}
