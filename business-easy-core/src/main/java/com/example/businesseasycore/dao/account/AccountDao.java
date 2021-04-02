package com.example.businesseasycore.dao.account;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.entities.AccountEntity;
import com.example.businesseasycore.entities.PeopleEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface AccountDao {
    Page<AccountEntity> getAccount(Map<String, String> parameterMap);

    AccountEntity createAccount(Account request);

    AccountEntity updateAccount(Account request);
}
