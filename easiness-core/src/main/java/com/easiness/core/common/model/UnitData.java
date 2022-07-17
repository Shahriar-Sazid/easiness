package com.easiness.core.common.model;

import com.easiness.core.entities.UnitConversionEntity;
import com.easiness.core.entities.UnitEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitData {
    List<UnitEntity> unitList;
    List<UnitConversionEntity> unitConversionList;
}
