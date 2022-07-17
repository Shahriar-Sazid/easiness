package com.easiness.core.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "place")
public class PlaceEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "name", unique = true)
    String name;

    @Column(name = "address")
    String address;

}
