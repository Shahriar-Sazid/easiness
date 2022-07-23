package com.easiness.core.services.stock;

import com.easiness.core.common.Util;
import com.easiness.core.common.model.InvoiceItem;
import com.easiness.core.common.model.MoveProductData;
import com.easiness.core.common.model.PurchaseOrderItem;
import com.easiness.core.common.model.Stock;
import com.easiness.core.entities.StockEntity;
import com.easiness.core.repositories.PlaceRepository;
import com.easiness.core.repositories.ProductRepository;
import com.easiness.core.repositories.StockRepository;
import com.easiness.core.repositories.UnitRepository;
import com.easiness.core.services.unit.UnitService;
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

    @Value("${precision.digit-count:6}")
    private Integer precision;

    @Override
    public List<StockEntity> storeProduct(List<PurchaseOrderItem> items) {
        Map<String, PurchaseOrderItem> itemMap = new HashMap<>();

        for (PurchaseOrderItem item : items) {
            String key = Util.concatWith(item.getProduct(), item.getPlace(), "_");

            if (itemMap.get(key) == null) {
                itemMap.put(key, item);
            } else {
                PurchaseOrderItem prevItem = itemMap.get(key);
                BigDecimal[] qtyAntCost = calculateCostAndQuantity(
                        prevItem.getQuantity(), prevItem.getCost(), prevItem.getUnit(),
                        item.getQuantity(), item.getCost(), item.getUnit());
                prevItem.setQuantity(qtyAntCost[0]);
                prevItem.setCost(qtyAntCost[1]);
            }
        }
        items = new ArrayList<>(itemMap.values());

        List<StockEntity> stockList = stockRepository.findByProduct_IdIn(items.stream()
                .map(PurchaseOrderItem::getProduct)
                .collect(Collectors.toList()));

        // filtering out the impurity
        stockList = stockList.stream()
                .filter(stock -> itemMap.get(Util.concatWith(stock.getProduct().getId(), stock.getPlace().getId(), "_")) != null)
                .collect(Collectors.toList());

        Map<String, StockEntity> stockMap = stockList.stream().collect(
                Collectors.toMap(stock -> Util.concatWith(stock.getProduct().getId(), stock.getPlace().getId(), "_"),
                        stock -> stock));

        List<PurchaseOrderItem> existingItems = items.stream().filter(
                        item -> stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_")) != null)
                .collect(Collectors.toList());
        List<PurchaseOrderItem> newItems = items.stream().filter(
                        item -> stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_")) == null)
                .collect(Collectors.toList());

        List<StockEntity> updatedStocks = updateExistingStock(stockMap, existingItems);
        List<StockEntity> newStocks = addNewStock(newItems);


        return stockRepository.saveAll(Stream.concat(updatedStocks.stream(), newStocks.stream()).collect(Collectors.toList()));
    }

    @Override
    public List<StockEntity> sellProduct(List<InvoiceItem> items) {
        List<StockEntity> stockList = stockRepository.findByIdIn(items.stream().map(InvoiceItem::getStock).collect(Collectors.toList()));

        Map<Long, StockEntity> stockMap = stockList.stream().collect(Collectors.toMap(StockEntity::getId, stockEntity -> stockEntity));

        for (InvoiceItem item : items) {
            StockEntity stock = stockMap.get(item.getStock());

            BigDecimal convertedQty = convertQty(stock.getUnit().getId(), item.getQuantity(), item.getUnit());
            stock.setQuantity(stock.getQuantity().add(convertedQty.negate()));
            stock.setLatestPrice(item.getPrice());
        }

        return stockRepository.saveAll(stockList);
    }

    @Override
    public Page<Stock> searchStock(Map<String, String> params) {
        Pageable pageable = PageRequest.of(Integer.parseInt(params.getOrDefault("page", "1")) - 1,
                Integer.parseInt(params.getOrDefault("pageSize", "10")));
        return stockRepository.searchStock(
                params.getOrDefault("name", ""),
                params.getOrDefault("type", ""),
                params.getOrDefault("brand", ""),
                params.get("placeId") != null ? Long.parseLong(params.get("placeId")) : null,
                pageable);
    }

    @Override
    public void moveProduct(List<MoveProductData> request) {

    }

    private List<StockEntity> updateExistingStock(Map<String, StockEntity> stockMap, List<PurchaseOrderItem> items) {
        List<StockEntity> stockList = new ArrayList<>();
        for (PurchaseOrderItem item : items) {
            StockEntity stock = stockMap.get(Util.concatWith(item.getProduct(), item.getPlace(), "_"));

            BigDecimal[] qtyAndCost = calculateCostAndQuantity(
                    stock.getQuantity(), stock.getCost(), stock.getUnit().getId()
                    , item.getQuantity(), item.getCost(), item.getUnit());

            stock.setQuantity(qtyAndCost[0]);
            stock.setCost(qtyAndCost[1]);
            stockList.add(stock);
        }
        return stockList;
    }

    private List<StockEntity> addNewStock(List<PurchaseOrderItem> items) {
        List<StockEntity> stockList = new ArrayList<>();
        for (PurchaseOrderItem item : items) {
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

    public BigDecimal[] calculateCostAndQuantity(final BigDecimal toQty, final BigDecimal toCost, final Long toUnit,
                                                 final BigDecimal qty, final BigDecimal cost, final Long unit) {
        BigDecimal newQty = toQty.add(convertQty(toUnit, qty, unit));
        BigDecimal newCost = (toCost.multiply(toQty).add((cost.multiply(qty))))
                .divide(toQty.add(qty), precision, RoundingMode.HALF_EVEN);

        return new BigDecimal[]{newQty, newCost};
    }

    public BigDecimal convertQty(Long toUnit, BigDecimal qty, Long unit) {
        return toUnit.equals(unit) ? qty : unitService.convert(unit, toUnit, qty);
    }
}
