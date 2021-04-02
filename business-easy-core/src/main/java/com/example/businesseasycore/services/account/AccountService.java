package com.example.businesseasycore.services.account;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.entities.AccountEntity;
import com.example.businesseasycore.entities.PeopleEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AccountService {
    Page<AccountEntity> getAccount(Map<String, String> parameterMap);

    Integer createAccount(Account request);

    AccountEntity updateAccount(Account request);

    ResponseEntity<ByteArrayResource> downloadAccountReport(Map<String, String> parameterMap);
}
