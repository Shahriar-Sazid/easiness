package com.example.businesseasycore.services.account;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.common.model.People;
import com.example.businesseasycore.dao.account.AccountDao;
import com.example.businesseasycore.entities.AccountEntity;
import com.example.businesseasycore.entities.PeopleEntity;
import com.example.businesseasycore.services.report.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService{
    @Autowired
    AccountDao accountDao;

    @Autowired
    ReportService reportService;

    @Override
    public Page<AccountEntity> getAccount(Map<String, String> parameterMap) {
        return accountDao.getAccount(parameterMap);
    }

    @Override
    public Integer createAccount(Account request) {
        AccountEntity accountEntity = accountDao.createAccount(request);

        return accountEntity.getId();
    }

    @Override
    public AccountEntity updateAccount(Account request) {
        return accountDao.updateAccount(request);
    }

    @Override
    public ResponseEntity<ByteArrayResource> downloadAccountReport(Map<String, String> parameterMap) {
        Page<AccountEntity> accountEntityPage = getAccount(parameterMap);
        List<AccountEntity> accountEntityList = accountEntityPage.getContent();

        return reportService.createAccountReport(accountEntityList,
                Optional.ofNullable(parameterMap.get("activeFilters")).orElse("<NO FILTER>"));
    }
}
