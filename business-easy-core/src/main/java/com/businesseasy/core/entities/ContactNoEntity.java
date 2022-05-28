package com.businesseasy.core.entities;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contact_no")
public class ContactNoEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "contact_no", nullable = false, unique = true)
    String contactNo;

    @Column(name = "owner_id")
    Long ownerId;
}
