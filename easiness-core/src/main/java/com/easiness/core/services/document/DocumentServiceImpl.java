package com.easiness.core.services.document;

import com.easiness.core.common.Util;
import com.easiness.core.common.enums.DocumentType;
import com.easiness.core.common.model.*;
import com.easiness.core.entities.DocumentEntity;
import com.easiness.core.entities.DocumentItemEntity;
import com.easiness.core.entities.StockEntity;
import com.easiness.core.exception_handler.InvalidRequestException;
import com.easiness.core.exception_handler.ReasonCode;
import com.easiness.core.repositories.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    DocumentItemRepository documentItemRepository;

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

    @Autowired
    ModelMapper modelMapper;

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
            totalCost = totalCost.add(item.getCost().multiply(item.getQuantity()));
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

    @Override
    public Page<Document> searchDocument(Map<String, String> params) {
        Pageable pageable = PageRequest.of(Integer.parseInt(params.getOrDefault("page", "1")) - 1,
                Integer.parseInt(params.getOrDefault("pageSize", "10")));

        Date from = null, to = null;
        try {
            from = Util.parseDate(params.getOrDefault("from", "2022-01-01T00:00:00.000Z"));
            to = Util.parseDate(params.getOrDefault("to", "2099-01-01T00:00:00.000Z"));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return documentRepository.searchDocument(
                from,
                to,
                params.getOrDefault("peopleName", ""),
                params.getOrDefault("type", ""),
                pageable);
    }

    @Override
    public DocumentDTO findDocumentById(Long id) {
        DocumentMeta documentMeta = documentRepository.findDocumentMetaById(id);
        if (documentMeta == null) {
            throw new InvalidRequestException(ReasonCode.DOCUMENT_NOT_FOUND.getMessage());
        }

        DocumentDTO documentDTO = modelMapper
                .typeMap(DocumentMeta.class, DocumentDTO.class)
                .map(documentMeta);

        documentDTO.setItems(documentItemRepository.findItemByDocumentId(id));

        return documentDTO;
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
