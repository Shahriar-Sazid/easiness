package com.businesseasy.core.services.stock;

import com.businesseasy.core.common.model.PurchaseOrderItem;
import com.businesseasy.core.common.model.Stock;
import com.businesseasy.core.entities.StockEntity;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface StockService {
    List<StockEntity> saveItemsInStock(List<PurchaseOrderItem> items);

    Page<Stock> searchStock(Map<String, String> params);
}
