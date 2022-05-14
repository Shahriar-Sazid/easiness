package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Purchase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/business/")
public class BusinessController {

    @PostMapping("purchase")
    void purchaseProduct(Purchase purchase) {
        
    }
}
