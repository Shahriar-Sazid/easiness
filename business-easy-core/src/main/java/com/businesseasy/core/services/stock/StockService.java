package com.businesseasy.core.services.stock;

import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.entities.StockEntity;

import java.util.List;

public interface StockService {
    List<StockEntity> saveItemsInStock(List<InvoiceItem> items);
}
