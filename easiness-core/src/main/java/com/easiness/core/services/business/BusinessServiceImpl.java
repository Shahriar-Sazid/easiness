package com.easiness.core.services.business;

import com.easiness.core.common.model.Invoice;
import com.easiness.core.common.model.PurchaseOrder;
import com.easiness.core.entities.StockEntity;
import com.easiness.core.services.account.AccountService;
import com.easiness.core.services.document.DocumentService;
import com.easiness.core.services.people.PeopleService;
import com.easiness.core.services.stock.StockService;
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
    public void purchase(PurchaseOrder purchaseOrder) {
        List<StockEntity> stockList = stockService.storeProduct(purchaseOrder.getItems());
        documentService.savePurchaseOrder(purchaseOrder, stockList);
        accountService.updateAccountBalance(purchaseOrder.getPayments());
        peopleService.updateSupplierBalance(purchaseOrder);
    }

    @Override
    public void sell(Invoice invoice) {
        List<StockEntity> stockList = stockService.sellProduct(invoice.getItems());
        documentService.saveInvoice(invoice, stockList);
        accountService.updateAccountBalance(invoice.getPayments());
        peopleService.updateCustomerBalance(invoice);
    }


}
