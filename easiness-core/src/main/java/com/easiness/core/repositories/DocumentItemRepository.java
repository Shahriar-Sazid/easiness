package com.easiness.core.repositories;

import com.easiness.core.common.model.DocumentItem;
import com.easiness.core.entities.DocumentItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentItemRepository extends JpaRepository<DocumentItemEntity, Long> {

    @Query(value ="SELECT NEW com.easiness.core.common.model.DocumentItem" +
            "(product.name, product.type, product.brand, product.country, " +
            "product.size, item.costOrPrice, item.quantity, item.unit.id, item.place.id)" +
            " FROM DocumentItemEntity item" +
            " LEFT JOIN item.product product ON item.product=product.id" +
            " WHERE item.documentId = :documentId")
    List<DocumentItem> findItemByDocumentId(@Param("documentId") Long documentId);
}
