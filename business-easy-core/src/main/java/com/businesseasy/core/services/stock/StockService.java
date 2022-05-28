package com.businesseasy.core.services.stock;

import com.businesseasy.core.common.model.InvoiceItem;

import java.util.List;

public interface StockService {
    void saveItemsInStock(List<InvoiceItem> items);
}
