package com.businesseasy.core.services.business;

import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.common.model.Payment;
import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.AccountEntity;
import com.businesseasy.core.repositories.AccountRepository;
import com.businesseasy.core.services.account.AccountService;
import com.businesseasy.core.services.document.DocumentService;
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
    AccountService accountService;

    @Autowired
    StockService stockService;

    @Autowired
    DocumentService documentService;

    @Override
    @Transactional
    public void purchase(Purchase purchaseObj) {
        stockService.saveItemsInStock(purchaseObj.getItems());
        documentService.savePurchaseDocument(purchaseObj);
        accountService.updateAccountBalance(purchaseObj.getPayments());
    }


}
