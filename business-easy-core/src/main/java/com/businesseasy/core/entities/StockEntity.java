package com.businesseasy.core.entities;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stock")
public class StockEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    ProductEntity product;

    @Column(name = "cost")
    BigDecimal cost;

    @Column(name = "quantity")
    BigDecimal quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    UnitEntity unitEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    PlaceEntity place;

}
