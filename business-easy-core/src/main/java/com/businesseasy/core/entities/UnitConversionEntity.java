package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.Operator;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "unit_conversion")
public class UnitConversionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "fromUnit")
    Long from;

    @Column(name = "toUnit")
    Long to;

    @Column(name = "cal_step")
    Integer calStep;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator")
    Operator operator;

    @Column(name = "constant")
    BigDecimal constant;
}
