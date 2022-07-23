package com.easiness.core.services.stock;

import com.easiness.core.common.model.InvoiceItem;
import com.easiness.core.common.model.MoveProductData;
import com.easiness.core.common.model.PurchaseOrderItem;
import com.easiness.core.common.model.Stock;
import com.easiness.core.entities.StockEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface StockService {
    List<StockEntity> storeProduct(List<PurchaseOrderItem> items);
    List<StockEntity> sellProduct(List<InvoiceItem> items);

    Page<Stock> searchStock(Map<String, String> params);

    void moveProduct(List<MoveProductData> request);
}
