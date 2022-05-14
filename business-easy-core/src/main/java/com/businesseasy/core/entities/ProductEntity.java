package com.businesseasy.core.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "product", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "type", "brand", "country", "size"})})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
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
