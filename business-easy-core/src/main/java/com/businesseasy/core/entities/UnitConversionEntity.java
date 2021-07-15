package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.Operator;
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
@Table(name = "unit_conversion")
public class UnitConversionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Integer id;

    @Column(name = "from")
    Integer from;

    @Column(name = "to")
    Integer to;

    @Column(name = "cal_step")
    Integer calStep;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator")
    Operator operator;

    @Column(name = "constant")
    BigDecimal constant;
}
