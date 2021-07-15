package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Account;
import com.businesseasy.core.entities.AccountEntity;
import com.businesseasy.core.services.account.AccountService;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.FileNotFoundException;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    @Autowired
    AccountService accountService;


    @GetMapping("")
    Page<AccountEntity> getAccount(@RequestParam Map<String, String> parameterMap) {
        return accountService.getAccount(parameterMap);
    }

    @PostMapping("")
    Integer createAccount(@Valid @RequestBody Account request) {
        return accountService.createAccount(request);
    }

    @PutMapping("")
    AccountEntity updateAccount(@Valid @RequestBody Account request) {
        return accountService.updateAccount(request);
    }

    @RequestMapping(value = "/report", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE, method = RequestMethod.GET)
    public ResponseEntity<ByteArrayResource> downloadProductReport(@RequestParam Map<String, String> parameterMap) {
        return accountService.downloadAccountReport(parameterMap);
    }
}
