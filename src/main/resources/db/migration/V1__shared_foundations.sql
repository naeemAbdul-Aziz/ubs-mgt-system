-- =============================================================================
-- V1 — Shared Foundations
-- Creates the audit_log table and enables the pgcrypto extension for UUIDv7.
-- =============================================================================

-- Enable UUID support (used by application for UUIDv7 generation)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- audit_log — Append-only audit trail (BR-SE-002)
-- =============================================================================
-- Design notes (doc 09 §6):
--   · No FK to domain tables — audit outlives archived/deleted records.
--   · No UPDATE or DELETE path exists in the application.
--   · Retention ≥ 7 years. Partition by year when volume warrants.
-- =============================================================================

CREATE TABLE audit_log (
    id                UUID        NOT NULL DEFAULT gen_random_uuid(),
    occurred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_account_id  UUID,                                    -- NULL for system actions
    action            TEXT        NOT NULL,                    -- e.g. 'STUDENT_CREATED'
    entity_type       TEXT        NOT NULL,                    -- e.g. 'Student'
    entity_id         UUID,                                    -- PK of the entity
    summary           JSONB,                                   -- before/after snapshot (no raw PII)
    ip_address        TEXT,

    CONSTRAINT pk_audit_log PRIMARY KEY (id),
    CONSTRAINT ck_audit_log_action_not_empty CHECK (action <> '')
);

-- Index for querying by entity (e.g. "show all changes to student X")
CREATE INDEX idx_audit_log_entity ON audit_log (entity_type, entity_id);

-- Index for querying by actor (e.g. "what did account Y do?")
CREATE INDEX idx_audit_log_actor ON audit_log (actor_account_id) WHERE actor_account_id IS NOT NULL;

-- Index for time-range queries (e.g. "audit entries for last 30 days")
CREATE INDEX idx_audit_log_occurred_at ON audit_log (occurred_at DESC);

COMMENT ON TABLE  audit_log IS 'Append-only audit trail. No UPDATE or DELETE paths exist in the application. Retention ≥ 7 years (BR-SE-002).';
COMMENT ON COLUMN audit_log.actor_account_id IS 'NULL for system-initiated actions (scheduled jobs, migrations).';
COMMENT ON COLUMN audit_log.summary IS 'JSONB snapshot — anonymised identifiers or safe field values only. No raw PII.';
