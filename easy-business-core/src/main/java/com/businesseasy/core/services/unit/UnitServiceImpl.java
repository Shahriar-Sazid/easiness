package com.businesseasy.core.services.unit;

import com.businesseasy.core.repositories.UnitConversionRepository;
import com.businesseasy.core.repositories.UnitRepository;
import com.businesseasy.core.common.model.UnitData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnitServiceImpl implements UnitService{
    @Autowired
    UnitRepository unitRepository;

    @Autowired
    UnitConversionRepository unitConversionRepository;

    @Override
    public UnitData getAllUnitData() {
        return UnitData.builder()
                .unitList(unitRepository.findAll())
                .unitConversionList(unitConversionRepository.findAll())
                .build();
    }
}
