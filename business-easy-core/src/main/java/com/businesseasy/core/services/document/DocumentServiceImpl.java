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
    public void savePurchaseOrder(PurchaseOrder purchaseOrder, List<StockEntity> stockList) {

        DocumentEntity document = DocumentEntity.builder()
                .people(peopleRepository.getOne(purchaseOrder.getSupplier()))
                .type(DocumentType.PURCHASE_ORDER)
                .documentItems(purchaseOrder.getItems().stream()
                        .map(item -> toDocumentItem(item, stockList)).collect(Collectors.toList()))
                .build();

        documentRepository.save(document);

    }

    @Override
    public void saveInvoice(Invoice invoice, List<StockEntity> stockList) {
        DocumentEntity document = DocumentEntity.builder()
                .people(peopleRepository.getOne(invoice.getCustomer()))
                .type(DocumentType.INVOICE)
                .documentItems(invoice.getItems().stream()
                        .map(item -> toDocumentItem(item, stockList)).collect(Collectors.toList()))
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

    DocumentItemEntity toDocumentItem(InvoiceItem item, List<StockEntity> stockList) {
        DocumentItemEntity documentItem = DocumentItemEntity.builder()
                .costOrPrice(item.getPrice())
                .quantity(item.getQuantity())
                .unit(unitRepository.getOne(item.getUnit()))
//                .product(stockRepository.getOne(item.getProduct()))
                .build();

//        for (StockEntity stock : stockList) {
//            if (stock.getPlace().getId().equals(item.getPlace()) && stock.getProduct().getId().equals(item.getProduct())) {
//                documentItem.setAffectedStock(stockRepository.getOne(stock.getId()));
//            }
//        }

        return documentItem;
    }
}
