package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.DocumentType;
import com.businesseasy.core.common.model.People;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "document")
public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "people_id")
    private PeopleEntity people;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name="type")
    @Enumerated(value = EnumType.STRING)
    private DocumentType type;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "document")
    private List<DocumentItemEntity> documentItems;

}
