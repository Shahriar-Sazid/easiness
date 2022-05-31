package com.businesseasy.core.repositories;

import com.businesseasy.core.common.model.Stock;
import com.businesseasy.core.entities.StockEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<StockEntity, Long> {
    List<StockEntity> findByProduct_IdIn(List<Long> productId);

    @Query(value = "select new com.businesseasy.core.common.model.Stock" +
            "(p.name, p.type, p.brand, p.country, p.size, pl.name, s.cost, s.quantity, un.name) from " +
            "StockEntity s LEFT JOIN s.product p on s.product = p.id " +
            "LEFT JOIN s.place pl on s.place = pl.id " +
            "LEFT JOIN s.unit un on s.unit = un.id where " +
            "p.name LIKE %:name% or :name IS NULL AND " +
            "p.type LIKE %:type% or :type IS NULL AND " +
            "p.brand LIKE %:brand% or :brand IS NULL AND " +
            "pl.id = :placeId or :placeId IS NULL")
    Page<Stock> searchStock(@Param("name") String name,
                            @Param("type") String type,
                            @Param("brand") String brand,
                            @Param("placeId") Long placeId,
                            Pageable pageable);

}
