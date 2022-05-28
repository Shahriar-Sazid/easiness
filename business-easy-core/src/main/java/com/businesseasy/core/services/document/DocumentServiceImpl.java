package com.businesseasy.core.services.document;

import com.businesseasy.core.common.model.Purchase;
import com.businesseasy.core.entities.DocumentEntity;
import com.businesseasy.core.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentServiceImpl implements DocumentService{
    @Autowired
    DocumentRepository documentRepository;

    @Override
    public void savePurchaseDocument(Purchase purchaseObj) {
        DocumentEntity document = DocumentEntity.builder()

                .build();
    }
}
