package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * An ordered level in the academic ladder (N1 ... JHS3).
 *
 * <p>Reference data seeded by migration; immutable from the application's perspective.
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "class_levels")
public class ClassLevel extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /** E.g. "Basic 1" for Primary 1. Nullable. */
    @Column(name = "basic_alias", length = 100)
    private String basicAlias;

    /** Determines logical progression (N1 -> N2 -> KG1). */
    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}
