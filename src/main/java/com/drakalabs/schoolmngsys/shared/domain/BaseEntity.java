package com.drakalabs.schoolmngsys.shared.domain;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

/**
 * Abstract base entity for all domain tables.
 *
 * <p>Provides:
 * <ul>
 *   <li>{@code id} — UUIDv7 primary key (time-ordered, index-friendly per ADR-002)</li>
 *   <li>{@code createdAt / updatedAt} — managed by Spring Data JPA auditing</li>
 *   <li>{@code createdBy / updatedBy} — account ID of the acting user</li>
 * </ul>
 *
 * <p>All domain entities extend this class. Business identifiers (studentNumber,
 * receiptNumber, etc.) are separate, human-facing columns — never the PK.
 *
 * @see com.drakalabs.schoolmngsys.shared.config.JpaConfig
 */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * Account ID of the user who created this record.
     * Populated automatically by Spring Data JPA auditing via {@code AuditorAware}.
     */
    @CreatedBy
    @Column(name = "created_by", updatable = false, columnDefinition = "uuid")
    private UUID createdBy;

    /**
     * Account ID of the user who last modified this record.
     * Populated automatically by Spring Data JPA auditing via {@code AuditorAware}.
     */
    @LastModifiedBy
    @Column(name = "updated_by", columnDefinition = "uuid")
    private UUID updatedBy;

    /**
     * Assigns a UUIDv7 primary key before persisting.
     * UUIDv7 is time-ordered, reducing B-tree index fragmentation vs. UUIDv4.
     */
    @PrePersist
    protected void assignId() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrdered();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BaseEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        // Use class identity until persisted (id may be null in transient state)
        return getClass().hashCode();
    }
}
