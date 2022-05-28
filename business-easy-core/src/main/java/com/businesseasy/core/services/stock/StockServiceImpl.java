package com.businesseasy.core.services.stock;

import com.businesseasy.core.common.Util;
import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.entities.StockEntity;
import com.businesseasy.core.repositories.PlaceRepository;
import com.businesseasy.core.repositories.ProductRepository;
import com.businesseasy.core.repositories.StockRepository;
import com.businesseasy.core.repositories.UnitRepository;
import com.businesseasy.core.services.unit.UnitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UnitRepository unitRepository;

    @Autowired
    UnitService unitService;

    @Value( "${precision.digit-count:6}" )
    private Integer precision;

    @Override
    public void saveItemsInStock(List<InvoiceItem> items) {
        Map<String, InvoiceItem> itemMap = items.stream().collect(
                Collectors.toMap(item -> Util.concatWith(item.getProduct(), item.getPlace(), "_"),
                        item -> item));

        List<StockEntity> stockList = stockRepository.findByProduct_IdIn(items.stream()
                .map(InvoiceItem::getProduct)
                .collect(Collectors.toList()));

        // filtering out the impurity
        stockList = stockList.stream()
                .filter(stock -> itemMap.get(Util.concatWith(stock.getProduct().getId(), stock.getPlace().getId(), "_")) != null)
                .collect(Collectors.toList());

        Map<String, StockEntity> stockMap = stockList.stream().collect(
                Collectors.toMap(stock -> Util.concatWith(stock.getProduct().getId(), stock.getPlace().getId(), "_"),
                        stock -> stock));

        List<InvoiceItem> existingItems = items.stream().filter(
                        item -> stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_")) != null)
                .collect(Collectors.toList());
        List<InvoiceItem> newItems = items.stream().filter(
                        item -> stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_")) == null)
                .collect(Collectors.toList());

        List<StockEntity> updatedStocks = updateExistingStock(stockMap, existingItems);
        List<StockEntity> newStocks = addNewStock(newItems);


        stockRepository.saveAll(Stream.concat(updatedStocks.stream(), newStocks.stream()).collect(Collectors.toList()));

    }

    private List<StockEntity> updateExistingStock(Map<String, StockEntity> stockMap, List<InvoiceItem> items) {
        List<StockEntity> stockList = new ArrayList<>();
        for (InvoiceItem item : items) {
            StockEntity stock = stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_"));

            if(!stock.getUnitEntity().getId().equals(item.getUnit())) {
                BigDecimal quantity = unitService.convert(item.getUnit(), stock.getUnitEntity().getId(), item.getQuantity());
                log.info("Quantity: {}", quantity);
                stock.setCost(
                        ((stock.getCost().multiply(stock.getQuantity())).add((quantity.multiply(item.getCost()))))
                                .divide(stock.getQuantity().add(quantity), precision, RoundingMode.HALF_EVEN));
                stock.setQuantity(stock.getQuantity().add(quantity));
            } else {
                stock.setCost(
                        ((stock.getCost().multiply(stock.getQuantity())).add((item.getQuantity().multiply(item.getCost()))))
                                .divide(stock.getQuantity().add(item.getQuantity()), precision, RoundingMode.HALF_EVEN));
                stock.setQuantity(stock.getQuantity().add(item.getQuantity()));
            }
        }
        return stockList;
    }

    private List<StockEntity> addNewStock(List<InvoiceItem> items) {
        List<StockEntity> stockList = new ArrayList<>();
        for (InvoiceItem item : items) {
            stockList.add(StockEntity.builder()
                    .product(productRepository.getOne(item.getProduct()))
                    .place(placeRepository.getOne(item.getPlace()))
                    .quantity(item.getQuantity())
                    .unitEntity(unitRepository.getOne(item.getUnit()))
                    .cost(item.getCost())
                    .build());
        }
        return stockList;
    }
}
