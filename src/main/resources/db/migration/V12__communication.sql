-- =============================================================================
-- V12 — Communication (WP-8)
-- message_templates, announcements, notification_outbox, notification_deliveries
-- =============================================================================

-- =============================================================================
-- message_templates
-- =============================================================================
CREATE TABLE message_templates (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    name             TEXT NOT NULL,
    subject          TEXT NOT NULL,
    body             TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_message_templates PRIMARY KEY (id),
    CONSTRAINT uq_message_templates_name UNIQUE (name)
);

-- =============================================================================
-- announcements
-- =============================================================================
CREATE TABLE announcements (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,
    body             TEXT NOT NULL,
    target_audience  TEXT NOT NULL, -- e.g. 'ALL', 'CLASS_LEVEL_ID', 'CLASS_ID'
    target_id        UUID, -- Can be null if ALL
    status           TEXT NOT NULL DEFAULT 'DRAFT',
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_announcements PRIMARY KEY (id),
    CONSTRAINT ck_announcements_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

-- =============================================================================
-- notification_outbox
-- Persistent Outbox for event-driven messaging (BR-CO-002)
-- =============================================================================
CREATE TABLE notification_outbox (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    event_type       TEXT NOT NULL,
    payload          TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_notification_outbox PRIMARY KEY (id),
    CONSTRAINT ck_notification_outbox_status CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED'))
);

-- =============================================================================
-- notification_deliveries
-- Audit log of actual deliveries (BR-CO-004)
-- =============================================================================
CREATE TABLE notification_deliveries (
    id                 UUID NOT NULL DEFAULT gen_random_uuid(),
    outbox_id          UUID,
    recipient          TEXT NOT NULL,
    message            TEXT NOT NULL,
    status             TEXT NOT NULL DEFAULT 'PENDING',
    provider_reference TEXT,
    cost               DECIMAL(10,4),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by         UUID,
    updated_by         UUID,

    CONSTRAINT pk_notification_deliveries PRIMARY KEY (id),
    CONSTRAINT fk_nd_outbox FOREIGN KEY (outbox_id) REFERENCES notification_outbox(id) ON DELETE SET NULL,
    CONSTRAINT ck_nd_status CHECK (status IN ('PENDING', 'SENT', 'FAILED'))
);
