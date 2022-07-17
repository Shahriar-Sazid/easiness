package com.easiness.core.services.unit;

import com.easiness.core.common.model.UnitData;
import com.easiness.core.entities.UnitConversionEntity;
import com.easiness.core.entities.UnitEntity;
import com.easiness.core.repositories.UnitConversionRepository;
import com.easiness.core.repositories.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnitServiceImpl implements UnitService{
    @Autowired
    UnitRepository unitRepository;

    @Autowired
    UnitConversionRepository unitConversionRepository;

    List<UnitEntity> unitList;
    List<UnitConversionEntity> unitConversions;

    @Value( "${precision.digit-count:6}" )
    private Integer precision;

    @PostConstruct
    private void didInitialize() {
        unitList = getUnits();
        unitConversions = getUnitConversions();
    }

    public List<UnitEntity> getUnits() {
        return unitRepository.findAll();
    }

    public List<UnitConversionEntity> getUnitConversions() {
        return unitConversionRepository.findAll();
    }

    @Override
    @Cacheable("unitData")
    public UnitData getAllUnitData() {
        return UnitData.builder()
                .unitList(unitList)
                .unitConversionList(unitConversions)
                .build();
    }

    @Override
    @Cacheable("conversion")
    public BigDecimal convert(Long from, Long to, BigDecimal value) {
        List<UnitConversionEntity> conversions = unitConversions.stream()
                .filter(conversion -> conversion.getFrom().equals(from) && conversion.getTo().equals(to))
                .sorted(Comparator.comparing(UnitConversionEntity::getCalStep))
                .collect(Collectors.toList());
        for(UnitConversionEntity conversion: conversions) {
            switch (conversion.getOperator()){
                case PLUS:
                    value = value.add(conversion.getConstant());
                    break;
                case MINUS:
                    value = value.add(conversion.getConstant().negate());
                    break;
                case MULTIPLY:
                    value = value.multiply(conversion.getConstant());
                    break;
                case DIVIDE:
                    value = value.divide(conversion.getConstant(), precision, RoundingMode.HALF_EVEN);
                    break;
            }

        }
        return value;
    }

}
