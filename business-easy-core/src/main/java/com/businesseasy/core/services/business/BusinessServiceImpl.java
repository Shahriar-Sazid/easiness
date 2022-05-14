package com.businesseasy.core.services.business;

import com.businesseasy.core.common.model.Payment;
import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.dao.account.AccountDao;
import com.businesseasy.core.dao.stock.StockDao;
import com.businesseasy.core.services.account.AccountService;
import com.businesseasy.core.services.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class BusinessServiceImpl implements BusinessService{

    @Autowired
    private AccountDao accountDao;

    @Autowired
    private StockDao stockDao;

    void updateAccountBalance(List<Payment> payments) {
        for(Payment payment: payments) {

        }
    }

    @Override
    @Transactional
    public void purchase(Purchase purchaseObj) {
        updateAccountBalance(purchaseObj.getPayments());
    }
}
