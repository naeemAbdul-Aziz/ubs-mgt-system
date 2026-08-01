package com.drakalabs.schoolmngsys.shared.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Append-only audit log entry.
 *
 * <p>Schema: every domain mutation + every approval + every auth event is written here
 * in the same transaction as the mutation (BR-SE-002). No foreign keys to domain tables
 * (audit outlives archived data). Retention ≥ 7 years.
 *
 * <p>This entity is intentionally <b>NOT</b> managed by JPA's auditing ({@code @CreatedDate})
 * because the audit log itself is an audit artifact — it should not be audited recursively.
 *
 * @see <a href="docs/09-data-architecture.md#6-audit-log-design">Data Architecture §6</a>
 * @see <a href="docs/04-business-rules.md">BR-SE-002</a>
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    private UUID id;

    /** When the action occurred (UTC). */
    @Column(name = "occurred_at", nullable = false, updatable = false)
    private Instant occurredAt;

    /** Account ID of the user who performed the action. Null for system actions. */
    @Column(name = "actor_account_id", updatable = false, columnDefinition = "uuid")
    private UUID actorAccountId;

    /** Human-readable action verb, e.g. "STUDENT_CREATED", "RESULT_PUBLISHED". */
    @Column(name = "action", nullable = false, updatable = false, length = 100)
    private String action;

    /** The entity type being acted upon, e.g. "Student", "TermResult". */
    @Column(name = "entity_type", nullable = false, updatable = false, length = 100)
    private String entityType;

    /** Primary key of the entity being acted upon. */
    @Column(name = "entity_id", updatable = false, columnDefinition = "uuid")
    private UUID entityId;

    /**
     * JSONB summary of before/after state or relevant identifiers.
     * Never contains raw PII — use anonymized identifiers or hashes.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "summary", updatable = false, columnDefinition = "jsonb")
    private Map<String, Object> summary;

    /** IP address of the request, if available. */
    @Column(name = "ip_address", updatable = false, length = 45)
    private String ipAddress;

    private AuditLog(Builder builder) {
        this.id = UUID.randomUUID();
        this.occurredAt = Instant.now();
        this.actorAccountId = builder.actorAccountId;
        this.action = builder.action;
        this.entityType = builder.entityType;
        this.entityId = builder.entityId;
        this.summary = builder.summary;
        this.ipAddress = builder.ipAddress;
    }

    public static Builder builder() {
        return new Builder();
    }

    // ─── Builder ──────────────────────────────────────────────────────────

    public static final class Builder {
        private UUID actorAccountId;
        private String action;
        private String entityType;
        private UUID entityId;
        private Map<String, Object> summary;
        private String ipAddress;

        public Builder actor(UUID actorAccountId) {
            this.actorAccountId = actorAccountId;
            return this;
        }

        public Builder action(String action) {
            this.action = action;
            return this;
        }

        public Builder entity(String entityType, UUID entityId) {
            this.entityType = entityType;
            this.entityId = entityId;
            return this;
        }

        public Builder summary(Map<String, Object> summary) {
            this.summary = summary;
            return this;
        }

        public Builder ip(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public AuditLog build() {
            return new AuditLog(this);
        }
    }
}
