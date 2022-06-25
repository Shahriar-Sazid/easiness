package com.businesseasy.core.services.business;

import com.businesseasy.core.common.model.Invoice;
import com.businesseasy.core.common.model.PurchaseOrder;

public interface BusinessService {

    void purchase(PurchaseOrder purchaseOrder);

    void sell(Invoice invoice);
}
