package com.businesseasy.core.repositories;

import com.businesseasy.core.common.model.Document;
import com.businesseasy.core.entities.DocumentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    @Query(value = "SELECT NEW com.businesseasy.core.common.model.Document" +
            "(d.createdAt, p.name, d.type, d.total, d.profit) FROM " +
            "DocumentEntity d LEFT JOIN d.people p ON d.people = p.id WHERE" +
            "(:peopleName = ''  OR UPPER(p.name) LIKE '%'||UPPER(:peopleName)||'%') AND " +
            "(:type = '' OR d.type = :type) AND " +
            "(d.createdAt BETWEEN :from AND :to) ")
    Page<Document> searchDocument(@Param("from") Date from,
                                  @Param("to") Date to,
                                  @Param("peopleName") String peopleName,
                                  @Param("type") String type,
                                  Pageable pageable);
}
