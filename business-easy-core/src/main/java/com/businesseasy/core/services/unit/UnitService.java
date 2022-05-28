package com.businesseasy.core.services.unit;

import com.businesseasy.core.common.model.UnitData;

import java.math.BigDecimal;

public interface UnitService {
    UnitData getAllUnitData();

    BigDecimal convert(Long from, Long to, BigDecimal amount);
}
