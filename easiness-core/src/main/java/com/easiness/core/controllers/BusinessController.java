package com.easiness.core.controllers;

import com.easiness.core.common.model.*;
import com.easiness.core.services.business.BusinessService;
import com.easiness.core.services.stock.StockService;
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
    void purchaseProduct(@Valid @RequestBody PurchaseOrder purchaseOrder) {
        businessService.purchase(purchaseOrder);
    }

    @PostMapping("sell")
    void sellProduct(@Valid @RequestBody Invoice invoice) {
        businessService.sell(invoice);
    }

    @GetMapping("stock")
    Page<Stock> searchStock(@RequestParam Map<String, String> params) {
        return stockService.searchStock(params);
    }

    @PostMapping("payment")
    void processPayments(@Valid @RequestBody PaymentTx paymentTx) {
        businessService.processPayments(paymentTx);
    }
}
