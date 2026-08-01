package com.drakalabs.schoolmngsys.auth.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * A fine-grained permission that can be assigned to {@link Role}s.
 *
 * <p>Naming standard: {@code DOMAIN_ACTION} uppercase snake, e.g. {@code STUDENT_CREATE},
 * {@code RESULT_PUBLISH}. Scope is NOT encoded in the string — applied per-role in the
 * service layer (doc 11 §3).
 *
 * <p>Seeded by {@code V3__seed_permissions_and_roles.sql}; the catalog extends by migration,
 * never edited in place (doc 14 §6).
 *
 * @see <a href="docs/14-implementation-plan.md#6-permission-catalog">Permission Catalog</a>
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity {

    /**
     * Unique permission code. Used in {@code @PreAuthorize} annotations and Spring Security.
     * Example: {@code STUDENT_CREATE}, {@code RESULT_PUBLISH}.
     */
    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "description", length = 255)
    private String description;
}
