package com.businesseasy.core.services.business;

import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.StockEntity;
import com.businesseasy.core.services.account.AccountService;
import com.businesseasy.core.services.document.DocumentService;
import com.businesseasy.core.services.people.PeopleService;
import com.businesseasy.core.services.stock.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Slf4j
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    AccountService accountService;

    @Autowired
    StockService stockService;

    @Autowired
    DocumentService documentService;

    @Autowired
    PeopleService peopleService;

    @Override
    @Transactional
    public void purchase(Purchase purchaseObj) {
        List<StockEntity> stockList = stockService.saveItemsInStock(purchaseObj.getItems());
        documentService.savePurchaseDocument(purchaseObj, stockList);
        accountService.updateAccountBalance(purchaseObj.getPayments());
        peopleService.updateSupplierBalance(purchaseObj);

    }


}
