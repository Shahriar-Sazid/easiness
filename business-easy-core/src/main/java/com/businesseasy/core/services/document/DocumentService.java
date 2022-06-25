package com.businesseasy.core.services.document;

import com.businesseasy.core.common.model.PurchaseOrder;
import com.businesseasy.core.entities.StockEntity;

import java.util.List;

public interface DocumentService {
    void savePurchaseDocument(PurchaseOrder purchaseOrder, List<StockEntity> stockList);
}
