-- =============================================================================
-- V8 — Attendance
-- attendance_records
-- =============================================================================

CREATE TABLE attendance_records (
    id                UUID        NOT NULL DEFAULT gen_random_uuid(),
    enrollment_id     UUID        NOT NULL,
    attendance_date   DATE        NOT NULL,
    status            TEXT        NOT NULL,
    marked_by         UUID        NOT NULL,
    correction_reason TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by        UUID,
    updated_by        UUID,

    CONSTRAINT pk_attendance_records PRIMARY KEY (id),
    -- BR-AT-001: One record per student per school day
    CONSTRAINT uq_attendance_records_enrollment_date UNIQUE (enrollment_id, attendance_date),
    CONSTRAINT ck_attendance_records_status CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'))
);

CREATE INDEX idx_attendance_records_enrollment ON attendance_records (enrollment_id);
CREATE INDEX idx_attendance_records_date ON attendance_records (attendance_date);

COMMENT ON TABLE attendance_records IS 'Daily attendance records for enrollments.';
