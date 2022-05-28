package com.businesseasy.core.services.document;

import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.StockEntity;

import java.util.List;

public interface DocumentService {
    void savePurchaseDocument(Purchase purchaseObj, List<StockEntity> stockList);
}
