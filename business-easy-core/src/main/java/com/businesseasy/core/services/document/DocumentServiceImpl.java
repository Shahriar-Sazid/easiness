package com.businesseasy.core.services.document;

import com.businesseasy.core.common.enums.DocumentType;
import com.businesseasy.core.common.model.Invoice;
import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.common.model.PurchaseOrder;
import com.businesseasy.core.common.model.PurchaseOrderItem;
import com.businesseasy.core.entities.DocumentEntity;
import com.businesseasy.core.entities.DocumentItemEntity;
import com.businesseasy.core.entities.StockEntity;
import com.businesseasy.core.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    PeopleRepository peopleRepository;

    @Autowired
    UnitRepository unitRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    StockRepository stockRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public void savePurchaseOrder(PurchaseOrder purchaseOrder, List<StockEntity> stockList) {
        BigDecimal totalCost = BigDecimal.ZERO;

        for (PurchaseOrderItem item : purchaseOrder.getItems()) {
            totalCost = totalCost.add(item.getCost().multiply(item.getQuantity()));
        }

        DocumentEntity document = DocumentEntity.builder()
                .people(peopleRepository.getOne(purchaseOrder.getSupplier()))
                .type(DocumentType.PURCHASE_ORDER)
                .total(totalCost)
                .documentItems(purchaseOrder.getItems().stream()
                        .map(item -> toDocumentItem(item, stockList)).collect(Collectors.toList()))
                .build();

        documentRepository.save(document);

    }

    @Override
    public void saveInvoice(Invoice invoice, List<StockEntity> stockList) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (InvoiceItem item : invoice.getItems()) {
            totalPrice = totalPrice.add(item.getPrice().multiply(item.getQuantity()));
        }

        BigDecimal totalCost = BigDecimal.ZERO;
        for (InvoiceItem item : invoice.getItems()) {
            totalCost = totalCost.add(item.getPrice().multiply(item.getQuantity()));
        }


        Map<Long, StockEntity> stockMap = stockList.stream().collect(Collectors.toMap(StockEntity::getId, stockEntity -> stockEntity));

        DocumentEntity document = DocumentEntity.builder()
                .people(peopleRepository.getOne(invoice.getCustomer()))
                .type(DocumentType.INVOICE)
                .total(totalPrice)
                .profit(totalPrice.add(totalCost.negate()))
                .documentItems(invoice.getItems().stream()
                        .map(item -> toDocumentItem(item, stockMap)).collect(Collectors.toList()))
                .build();

        documentRepository.save(document);
    }


    DocumentItemEntity toDocumentItem(PurchaseOrderItem item, List<StockEntity> stockList) {
        DocumentItemEntity documentItem = DocumentItemEntity.builder()
                .costOrPrice(item.getCost())
                .place(placeRepository.getOne(item.getPlace()))
                .quantity(item.getQuantity())
                .unit(unitRepository.getOne(item.getUnit()))
                .product(productRepository.getOne(item.getProduct()))
                .build();

        for (StockEntity stock : stockList) {
            if (stock.getPlace().getId().equals(item.getPlace()) && stock.getProduct().getId().equals(item.getProduct())) {
                documentItem.setAffectedStock(stockRepository.getOne(stock.getId()));
            }
        }

        return documentItem;
    }

    DocumentItemEntity toDocumentItem(InvoiceItem item, Map<Long, StockEntity> stockMap) {

        return DocumentItemEntity.builder()
                .costOrPrice(item.getPrice())
                .quantity(item.getQuantity())
                .unit(unitRepository.getOne(item.getUnit()))
                .affectedStock(stockRepository.getOne(item.getStock()))
                .product(stockMap.get(item.getStock()).getProduct())
                .build();
    }
}
