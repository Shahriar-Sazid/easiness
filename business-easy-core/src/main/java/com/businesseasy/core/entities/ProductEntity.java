package com.businesseasy.core.entities;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "product", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "type", "brand", "country", "size"})})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "name")
    String name;

    @Column(name = "type")
    String type;

    @Column(name = "brand")
    String brand;

    @Column(name = "country")
    String country;

    @Column(name = "size")
    String size;
}
