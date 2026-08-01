-- V7 — Enrollment (WP-4)
-- enrollments + partial unique index (BR-EN-001: one active enrollment per student per year)

CREATE TABLE enrollments (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    student_id       UUID NOT NULL,
    class_id         UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    status           TEXT NOT NULL DEFAULT 'ACTIVE',
    roll_number      INT,
    exit_reason      TEXT,
    exit_date        DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_enrollments PRIMARY KEY (id),
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_enrollments_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
    CONSTRAINT ck_enrollments_status CHECK (status IN ('ACTIVE', 'TRANSFERRED', 'WITHDRAWN', 'COMPLETED'))
);

-- Enforce BR-EN-001: A Student has at most one ACTIVE Enrollment per Academic Year
CREATE UNIQUE INDEX uq_active_enrollment_per_student_year 
ON enrollments (student_id, academic_year_id) 
WHERE status = 'ACTIVE';
