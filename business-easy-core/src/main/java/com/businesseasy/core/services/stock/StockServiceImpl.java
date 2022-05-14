package com.businesseasy.core.services.stock;

import com.businesseasy.core.dao.stock.StockDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockServiceImpl {
    @Autowired
    private StockDao stockDao;
}
