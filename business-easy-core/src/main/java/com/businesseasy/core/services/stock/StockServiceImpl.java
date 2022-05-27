package com.businesseasy.core.services.stock;

import com.businesseasy.core.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;
}
