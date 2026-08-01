package com.drakalabs.schoolmngsys.auth.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * A named bundle of permissions.
 *
 * <p>RBAC model: users hold roles; roles hold permissions; endpoints check permissions.
 * New roles can be composed (by assigning permissions) without code changes (doc 03 §1).
 *
 * <p>Seeded by {@code V3__seed_permissions_and_roles.sql}; roles are not user-created.
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private RoleName name;

    @Column(name = "description", length = 255)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    // ─── Roles (doc 03 §2) ────────────────────────────────────────────────

    public enum RoleName {
        SYSTEM_ADMIN,
        HEAD_OF_SCHOOL,
        SCHOOL_ADMIN,
        HOD,
        TEACHER,
        ACCOUNTANT,
        LIBRARIAN,
        NURSE,
        GUARDIAN,
        STUDENT
    }
}
