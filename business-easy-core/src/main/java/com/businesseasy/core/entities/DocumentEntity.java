package com.businesseasy.core.entities;

import com.businesseasy.core.common.enums.DocumentType;
import com.businesseasy.core.common.model.People;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
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
    private PeopleEntity people;

    @Column(name="type")
    @Enumerated(value = EnumType.STRING)
    private DocumentType type;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentItemEntity> documentItems;

}
