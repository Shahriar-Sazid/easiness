package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.services.business.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/business/")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @PostMapping("purchase")
    void purchaseProduct(@Valid @RequestBody Purchase purchaseObj) {
        businessService.purchase(purchaseObj);
    }
}
