package com.businesseasy.core.common.model;

import com.businesseasy.core.entities.UnitConversionEntity;
import com.businesseasy.core.entities.UnitEntity;
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
