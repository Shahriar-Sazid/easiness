package com.easiness.core.controllers;

import com.easiness.core.services.unit.UnitService;
import com.easiness.core.common.model.UnitData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/unit/")
public class UnitController {
    @Autowired
    UnitService unitService;


    @GetMapping("all")
    UnitData getUnitData() {
        return unitService.getAllUnitData();
    }

    @GetMapping("convert")
    BigDecimal convert(@RequestParam(name = "from") Long from,
                       @RequestParam(name = "to") Long to,
                       @RequestParam(name = "data") BigDecimal data) {
        return unitService.convert(from, to, data);
    }
}
