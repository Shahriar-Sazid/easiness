package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.common.model.Stock;
import com.businesseasy.core.services.business.BusinessService;
import com.businesseasy.core.services.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/business/")
public class BusinessController {

    @Autowired
    BusinessService businessService;

    @Autowired
    StockService stockService;

    @PostMapping("purchase")
    void purchaseProduct(@Valid @RequestBody Purchase purchaseObj) {
        businessService.purchase(purchaseObj);
    }

    @GetMapping("stock")
    Page<Stock> searchStock(@RequestParam Map<String, String> params) {
        return stockService.searchStock(params);
    }
}
