package com.easiness.core.services.business;

import com.easiness.core.common.model.Invoice;
import com.easiness.core.common.model.PurchaseOrder;
import com.easiness.core.common.model.PaymentTx;
import com.easiness.core.entities.DocumentEntity;
import com.easiness.core.entities.StockEntity;
import com.easiness.core.services.account.AccountService;
import com.easiness.core.services.document.DocumentService;
import com.easiness.core.services.people.PeopleService;
import com.easiness.core.services.stock.StockService;
import com.easiness.core.services.tx.TxService;
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

    @Autowired
    TxService txService;

    @Override
    @Transactional
    public void purchase(PurchaseOrder purchaseOrder) {
        List<StockEntity> stockList = stockService.storeProduct(purchaseOrder.getItems());
        DocumentEntity document = documentService.savePurchaseOrder(purchaseOrder, stockList);
        accountService.updateAccountBalance(purchaseOrder.getPayments());
        peopleService.updateSupplierBalance(purchaseOrder);
        txService.saveTx(PaymentTx.builder()
                .payments(purchaseOrder.getPayments())
                .docId(document.getId())
                .peopleId(purchaseOrder.getSupplier())
                .build());
    }

    @Override
    @Transactional
    public void sell(Invoice invoice) {
        List<StockEntity> stockList = stockService.sellProduct(invoice.getItems());
        DocumentEntity document = documentService.saveInvoice(invoice, stockList);
        accountService.updateAccountBalance(invoice.getPayments());
        peopleService.updateCustomerBalance(invoice);
        txService.saveTx(PaymentTx.builder()
                        .payments(invoice.getPayments())
                        .docId(document.getId())
                        .peopleId(invoice.getCustomer())
                .build());
    }

    @Override
    public void processPayments(PaymentTx paymentTx) {
        accountService.updateAccountBalance(paymentTx.getPayments());
        DocumentEntity document = documentService.getDocumentEntity(paymentTx.getDocId());
        paymentTx.setPeopleId(document.getPeople().getId());
        peopleService.updateCustomerBalanceAfterPayment(paymentTx.getPeopleId(), paymentTx.getPayments());
        txService.saveTx(paymentTx);
    }

}
