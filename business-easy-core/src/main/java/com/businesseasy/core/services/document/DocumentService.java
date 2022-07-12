package com.businesseasy.core.services.document;

import com.businesseasy.core.common.model.Document;
import com.businesseasy.core.common.model.Invoice;
import com.businesseasy.core.common.model.PurchaseOrder;
import com.businesseasy.core.entities.StockEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface DocumentService {
    void savePurchaseOrder(PurchaseOrder purchaseOrder, List<StockEntity> stockList);

    void saveInvoice(Invoice invoice, List<StockEntity> stockList);

    Page<Document> searchDocument(Map<String, String> params);
}
