package com.easiness.core.services.document;

import com.easiness.core.common.model.Document;
import com.easiness.core.common.model.DocumentDTO;
import com.easiness.core.common.model.Invoice;
import com.easiness.core.common.model.PurchaseOrder;
import com.easiness.core.entities.StockEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface DocumentService {
    void savePurchaseOrder(PurchaseOrder purchaseOrder, List<StockEntity> stockList);

    void saveInvoice(Invoice invoice, List<StockEntity> stockList);

    Page<Document> searchDocument(Map<String, String> params);

    DocumentDTO findDocumentById(Long id);
}
