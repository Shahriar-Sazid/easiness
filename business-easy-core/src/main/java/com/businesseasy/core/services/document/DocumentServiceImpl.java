package com.businesseasy.core.services.document;

import com.businesseasy.core.common.enums.DocumentType;
import com.businesseasy.core.common.model.InvoiceItem;
import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.DocumentEntity;
import com.businesseasy.core.entities.DocumentItemEntity;
import com.businesseasy.core.entities.StockEntity;
import com.businesseasy.core.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public void savePurchaseDocument(Purchase purchaseObj, List<StockEntity> stockList) {

        DocumentEntity document = DocumentEntity.builder()
                .people(peopleRepository.getOne(purchaseObj.getSupplier()))
                .type(DocumentType.PURCHASE_ORDER)
                .documentItems(purchaseObj.getItems().stream()
                        .map(item -> toDocumentItem(item, stockList)).collect(Collectors.toList()))
                .build();

        documentRepository.save(document);

    }


    DocumentItemEntity toDocumentItem(InvoiceItem item, List<StockEntity> stockList) {
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
}
