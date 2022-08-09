package com.easiness.core.services.business;

import com.easiness.core.common.model.Invoice;
import com.easiness.core.common.model.PurchaseOrder;
import com.easiness.core.common.model.PaymentTx;

public interface BusinessService {

    void purchase(PurchaseOrder purchaseOrder);

    void sell(Invoice invoice);

    void processPayments(PaymentTx paymentTx);
}
