package com.drakalabs.schoolmngsys.auth.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * A user account — the authentication identity for a Staff, Guardian, or Student.
 *
 * <p>Key invariants:
 * <ul>
 *   <li>Account ≠ Person (ADR-004). A {@code UserAccount} links to a person record
 *       but is not the person's canonical record.</li>
 *   <li>Accounts are provisioned by the system, never self-registered (BR-SE-003).</li>
 *   <li>On deactivation, all refresh tokens are immediately revoked (FR-AUTH-04).</li>
 * </ul>
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "accounts",
        uniqueConstraints = @UniqueConstraint(name = "uq_accounts_username", columnNames = "username")
)
public class UserAccount extends BaseEntity {

    /** Login identifier — staff number, phone, or chosen username. */
    @Column(name = "username", nullable = false, length = 100)
    private String username;

    /** Argon2id or BCrypt hash. Never stored plaintext. */
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    /** Type of person this account is linked to. */
    @Enumerated(EnumType.STRING)
    @Column(name = "person_type", nullable = false, length = 20)
    private PersonType personType;

    /** FK to the person record (Student.id / Guardian.id / Staff.id). Not enforced as DB FK — cross-module. */
    @Column(name = "person_id", nullable = false, columnDefinition = "uuid")
    private UUID personId;

    /** Whether the account is currently active. Deactivated = no login; tokens revoked. */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;

    /** Forces password change on first login or after an admin reset. */
    @Column(name = "must_change_password", nullable = false)
    private boolean mustChangePassword = true;

    /** Roles assigned to this account. Many-to-many through {@code account_roles}. */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "account_roles",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // ─── Factory method ───────────────────────────────────────────────────

    public static UserAccount provision(String username, String passwordHash,
                                        PersonType personType, UUID personId) {
        var account = new UserAccount();
        account.username = username;
        account.passwordHash = passwordHash;
        account.personType = personType;
        account.personId = personId;
        account.status = AccountStatus.ACTIVE;
        account.mustChangePassword = true;
        return account;
    }

    public void deactivate() {
        this.status = AccountStatus.INACTIVE;
    }

    public boolean isActive() {
        return this.status == AccountStatus.ACTIVE;
    }

    // ─── Nested enums ─────────────────────────────────────────────────────

    public enum PersonType {
        STAFF, GUARDIAN, STUDENT
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE
    }
}
