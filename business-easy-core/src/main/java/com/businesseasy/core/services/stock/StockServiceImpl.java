package com.businesseasy.core.services.stock;

import com.businesseasy.core.common.Util;
import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.common.model.Stock;
import com.businesseasy.core.entities.StockEntity;
import com.businesseasy.core.repositories.PlaceRepository;
import com.businesseasy.core.repositories.ProductRepository;
import com.businesseasy.core.repositories.StockRepository;
import com.businesseasy.core.repositories.UnitRepository;
import com.businesseasy.core.services.unit.UnitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
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
    public List<StockEntity> saveItemsInStock(List<InvoiceItem> items) {
        Map<String, InvoiceItem> itemMap = new HashMap<>();

        for(InvoiceItem item: items) {
            String key = Util.concatWith(item.getProduct(), item.getPlace(), "_");

            if(itemMap.get(key) == null) {
                itemMap.put(key, item);
            } else {
                InvoiceItem prevItem = itemMap.get(key);
                BigDecimal[] qtyAntCost = calculateCostAndQuantity(
                        prevItem.getQuantity(), prevItem.getCost(), prevItem.getUnit(),
                        item.getQuantity(), item.getCost(), item.getUnit());
                prevItem.setQuantity(qtyAntCost[0]);
                prevItem.setCost(qtyAntCost[1]);
            }
        }
        items = new ArrayList<>(itemMap.values());

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


        return stockRepository.saveAll(Stream.concat(updatedStocks.stream(), newStocks.stream()).collect(Collectors.toList()));
    }

    @Override
    public Page<Stock> searchStock(Map<String, String> params) {
        Pageable pageable = PageRequest.of(Integer.parseInt(params.getOrDefault("page", "1"))-1,
                Integer.parseInt(params.getOrDefault("pageSize", "10")));
        return stockRepository.searchStock(
                params.get("name"),
                params.get("type"),
                params.get("brand"),
                params.get("placeId") != null? Long.parseLong(params.get("placeId")): null,
                pageable);
    }

    private List<StockEntity> updateExistingStock(Map<String, StockEntity> stockMap, List<InvoiceItem> items) {
        List<StockEntity> stockList = new ArrayList<>();
        for (InvoiceItem item : items) {
            StockEntity stock = stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_"));

            BigDecimal[] qtyAndCost = calculateCostAndQuantity(
                    stock.getQuantity(), stock.getCost(), stock.getUnit().getId()
                    ,item.getQuantity(), item.getCost(), item.getUnit());

            stock.setQuantity(qtyAndCost[0]);
            stock.setCost(qtyAndCost[1]);
            stockList.add(stock);
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
                    .unit(unitRepository.getOne(item.getUnit()))
                    .cost(item.getCost())
                    .build());
        }
        return stockList;
    }

    public BigDecimal[] calculateCostAndQuantity(BigDecimal toQty, BigDecimal toCost, Long toUnit,
                                                 BigDecimal qty, BigDecimal cost, Long unit) {

        qty = toUnit.equals(unit)? qty : unitService.convert(unit, toUnit, qty);

        BigDecimal newQty = toQty.add(qty);
        BigDecimal newCost = (toCost.multiply(toQty).add((cost.multiply(qty))))
                .divide(toQty.add(qty), precision, RoundingMode.HALF_EVEN);

        return new BigDecimal[]{newQty, newCost};
    }
}
