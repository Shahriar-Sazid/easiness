package com.easiness.core.repositories;

import com.easiness.core.common.enums.TxType;
import com.easiness.core.common.model.Tx;
import com.easiness.core.entities.TxEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;

public interface TxRepository extends JpaRepository<TxEntity, Long> {

    @Query(value = "SELECT NEW com.easiness.core.common.model.Tx" +
            "(t.id, t.amount, t.fromAccount.id, t.toAccount.id, p.id, p.name," +
            " t.document.id, t.ref, t.type, t.meta, t.purpose, t.createdAt) FROM " +
            "TxEntity t LEFT JOIN t.people p ON t.people = p.id WHERE" +
            "(:peopleName = ''  OR UPPER(p.name) LIKE '%'||UPPER(:peopleName)||'%') AND " +
            "(:type IS NULL OR t.type = :type) AND " +
            "(:account IS NULL OR :account = t.fromAccount.id OR :account = t.toAccount.id) AND " +
            "(t.createdAt BETWEEN :from AND :to) ")
    Page<Tx> searchTx(@Param("from") Date from,
                      @Param("to") Date to,
                      @Param("type") TxType type,
                      @Param("peopleName") String peopleName,
                      @Param("account") Long account,
                      Pageable pageable);
}
