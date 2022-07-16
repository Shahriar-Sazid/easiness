package com.businesseasy.core.repositories;

import com.businesseasy.core.common.model.DocumentItem;
import com.businesseasy.core.entities.DocumentItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentItemRepository extends JpaRepository<DocumentItemEntity, Long> {

    @Query(value ="SELECT NEW com.businesseasy.core.common.model.DocumentItem" +
            "(product.name, product.type, product.brand, product.country, " +
            "product.size, item.costOrPrice, item.quantity, item.unit.id, item.place.id)" +
            " FROM DocumentItemEntity item" +
            " LEFT JOIN item.product product ON item.product=product.id" +
            " WHERE item.documentId = :documentId")
    List<DocumentItem> findItemByDocumentId(@Param("documentId") Long documentId);
}
