package com.businesseasy.core.services.account;

import com.businesseasy.core.entities.AccountEntity;
import com.businesseasy.core.common.model.Account;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AccountService {
    Page<AccountEntity> getAccount(Map<String, String> parameterMap);

    Long createAccount(Account request);

    AccountEntity updateAccount(Account request);

    ResponseEntity<ByteArrayResource> downloadAccountReport(Map<String, String> parameterMap);

    List<AccountEntity> getAllAccount();
}
