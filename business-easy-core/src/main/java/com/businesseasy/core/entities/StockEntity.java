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
@Table(name = "stock")
public class StockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    Long id;

    @Column(name = "cost")
    BigDecimal cost;

    @Column(name = "quantity")
    BigDecimal quantity;

    @ManyToOne
    @JoinColumn(name = "product_id")
    ProductEntity productEntity;

    @ManyToOne
    @JoinColumn(name = "place")
    PlaceEntity placeEntity;

    @ManyToOne
    @JoinColumn(name = "unit")
    UnitEntity unitEntity;
}
