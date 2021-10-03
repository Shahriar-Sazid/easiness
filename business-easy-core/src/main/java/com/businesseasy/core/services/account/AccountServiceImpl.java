package com.businesseasy.core.services.account;

import com.businesseasy.core.dao.account.AccountDao;
import com.businesseasy.core.services.report.ReportService;
import com.businesseasy.core.common.model.Account;
import com.businesseasy.core.entities.AccountEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    @Override
    public List<AccountEntity> getAllAccount() {
        return accountDao.getAllAccount();
    }
}
