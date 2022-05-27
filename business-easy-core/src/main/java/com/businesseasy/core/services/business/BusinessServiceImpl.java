package com.businesseasy.core.services.business;

import com.businesseasy.core.common.model.Payment;
import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.AccountEntity;
import com.businesseasy.core.repositories.AccountRepository;
import com.businesseasy.core.services.account.AccountService;
import com.businesseasy.core.services.stock.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StockService stockService;

    void updateAccountBalance(List<Payment> payments) {
        if (payments != null) {
            List<AccountEntity> accountEntities = accountRepository.findByIdIn(
                    payments.stream().map(Payment::getTargetAccount).collect(Collectors.toList()));

            Map<Long, AccountEntity> accountMap = accountEntities.stream().collect(Collectors.toMap(AccountEntity::getId, item -> item));

            for(Payment payment : payments) {
                AccountEntity account = accountMap.get(payment.getTargetAccount());
                account.setBalance(account.getBalance().add(payment.getAmount()));
                accountRepository.save(account);
            }
        }
    }

    @Override
    @Transactional
    public void purchase(Purchase purchaseObj) {
        updateAccountBalance(purchaseObj.getPayments());

    }
}
