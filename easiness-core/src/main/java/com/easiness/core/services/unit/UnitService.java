package com.easiness.core.services.unit;

import com.easiness.core.common.model.UnitData;

import java.math.BigDecimal;

public interface UnitService {
    UnitData getAllUnitData();

    BigDecimal convert(Long from, Long to, BigDecimal value);
}
