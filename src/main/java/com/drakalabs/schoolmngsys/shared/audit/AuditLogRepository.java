package com.drakalabs.schoolmngsys.shared.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

/**
 * Repository for the append-only audit log.
 *
 * <p>Only append (save) and query operations are exposed — no update or delete paths exist.
 * This is a deliberate design: the audit log is immutable once written (BR-SE-002).
 *
 * <p>Accessible to: {@code SYSTEM_ADMIN} (full query), {@code HEAD_OF_SCHOOL} (read-only).
 *
 * @see AuditLog
 */
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId, Pageable pageable);

    Page<AuditLog> findByActorAccountId(UUID actorAccountId, Pageable pageable);

    @Query("""
            SELECT a FROM AuditLog a
            WHERE (:entityType IS NULL OR a.entityType = :entityType)
              AND (:entityId   IS NULL OR a.entityId   = :entityId)
              AND (:actorId    IS NULL OR a.actorAccountId = :actorId)
              AND (:from       IS NULL OR a.occurredAt >= :from)
              AND (:to         IS NULL OR a.occurredAt <= :to)
            """)
    Page<AuditLog> query(
            @Param("entityType") String entityType,
            @Param("entityId")   UUID entityId,
            @Param("actorId")    UUID actorId,
            @Param("from")       Instant from,
            @Param("to")         Instant to,
            Pageable pageable
    );
}
