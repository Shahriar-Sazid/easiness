package com.businesseasy.core.dao.account;

import com.businesseasy.core.common.model.Account;
import com.businesseasy.core.entities.AccountEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface AccountDao {
    Page<AccountEntity> getAccount(Map<String, String> parameterMap);

    AccountEntity createAccount(Account request);

    AccountEntity updateAccount(Account request);
}
