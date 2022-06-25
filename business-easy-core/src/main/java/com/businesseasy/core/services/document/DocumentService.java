package com.businesseasy.core.services.document;

import com.businesseasy.core.common.model.Invoice;
import com.businesseasy.core.common.model.PurchaseOrder;
import com.businesseasy.core.entities.StockEntity;

import java.util.List;

public interface DocumentService {
    void savePurchaseOrder(PurchaseOrder purchaseOrder, List<StockEntity> stockList);

    void saveInvoice(Invoice invoice, List<StockEntity> stockList);
}
