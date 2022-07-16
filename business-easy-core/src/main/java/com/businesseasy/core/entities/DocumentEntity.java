package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.DocumentType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "document")
public class DocumentEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "people_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PeopleEntity people;

    @Column(name="type")
    @Enumerated(value = EnumType.STRING)
    private DocumentType type;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "profit")
    private BigDecimal profit;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "document_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private List<DocumentItemEntity> documentItems;

}
