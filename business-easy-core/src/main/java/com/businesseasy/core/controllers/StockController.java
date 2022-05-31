package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Stock;
import com.businesseasy.core.services.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    @Autowired
    StockService stockService;


    @GetMapping("")
    Page<Stock> searchStock(@RequestParam Map<String, String> params) {
        return stockService.searchStock(params);
    }
}
