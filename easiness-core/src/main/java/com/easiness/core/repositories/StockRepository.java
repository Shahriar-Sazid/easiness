package com.easiness.core.repositories;

import com.easiness.core.common.model.Stock;
import com.easiness.core.entities.StockEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<StockEntity, Long> {
    List<StockEntity> findByProduct_IdIn(List<Long> productId);
    List<StockEntity> findByIdIn(List<Long> idList);

    @Query(value = "select new com.easiness.core.common.model.Stock" +
            "(s.id, p.id, p.name, p.type, p.brand, p.country, p.size, pl.name, pl.id, s.cost, s.quantity, un.name, un.id) from " +
            "StockEntity s LEFT JOIN s.product p on s.product = p.id " +
            "LEFT JOIN s.place pl on s.place = pl.id " +
            "LEFT JOIN s.unit un on s.unit = un.id where " +
            "(:name = ''  OR UPPER(p.name) LIKE '%'||UPPER(:name)||'%') AND " +
            "(:type = '' OR UPPER(p.type) LIKE '%'||UPPER(:type)||'%') AND " +
            "(:brand = '' OR UPPER(p.brand) LIKE '%'||UPPER(:brand)||'%') AND " +
            "(pl.id = :placeId or :placeId IS NULL) AND " +
            "s.quantity > 0")
    Page<Stock> searchStock(@Param("name") String name,
                            @Param("type") String type,
                            @Param("brand") String brand,
                            @Param("placeId") Long placeId,
                            Pageable pageable);

}
