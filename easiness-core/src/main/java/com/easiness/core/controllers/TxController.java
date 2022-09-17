package com.easiness.core.controllers;


import com.easiness.core.common.model.Tx;
import com.easiness.core.entities.ProductEntity;
import com.easiness.core.services.tx.TxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tx")
public class TxController {

    @Autowired
    TxService txService;

    @GetMapping("")
    Page<Tx> searchTx(@RequestParam Map<String, String> parameterMap) {

        return txService.searchTx(parameterMap);
    }

}
