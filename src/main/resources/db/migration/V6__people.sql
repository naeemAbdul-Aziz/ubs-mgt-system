-- =============================================================================
-- V6 — People Registry (Students, Guardians, Staff)
-- =============================================================================

-- =============================================================================
-- students
-- =============================================================================
CREATE TABLE students (
    id              UUID NOT NULL DEFAULT gen_random_uuid(),
    student_number  TEXT NOT NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    other_names     TEXT,
    date_of_birth   DATE NOT NULL,
    gender          TEXT NOT NULL,
    admission_date  DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'ACTIVE',
    photo           BYTEA,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,

    CONSTRAINT pk_students PRIMARY KEY (id),
    CONSTRAINT uq_students_number UNIQUE (student_number),
    CONSTRAINT ck_students_status CHECK (status IN ('APPLICANT', 'ACTIVE', 'TRANSFERRED_OUT', 'WITHDRAWN', 'GRADUATED', 'DECEASED'))
);

-- =============================================================================
-- guardians
-- =============================================================================
CREATE TABLE guardians (
    id          UUID NOT NULL DEFAULT gen_random_uuid(),
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    other_names TEXT,
    phone       TEXT NOT NULL,
    email       TEXT,
    occupation  TEXT,
    address     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_guardians PRIMARY KEY (id)
);

-- =============================================================================
-- student_guardians
-- Join table connecting a student to a guardian, carrying relationship flags
-- =============================================================================
CREATE TABLE student_guardians (
    id                        UUID NOT NULL DEFAULT gen_random_uuid(),
    student_id                UUID NOT NULL,
    guardian_id               UUID NOT NULL,
    relationship_type         TEXT NOT NULL, -- MOTHER, FATHER, GRANDPARENT, AUNT_UNCLE, SIBLING, OTHER
    is_primary_contact        BOOLEAN NOT NULL DEFAULT false,
    has_custody               BOOLEAN NOT NULL DEFAULT false,
    receives_billing          BOOLEAN NOT NULL DEFAULT false,
    receives_academic_reports BOOLEAN NOT NULL DEFAULT false,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by                UUID,
    updated_by                UUID,

    CONSTRAINT pk_student_guardians PRIMARY KEY (id),
    CONSTRAINT fk_sg_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_sg_guardian FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE CASCADE,
    CONSTRAINT uq_sg_student_guardian UNIQUE (student_id, guardian_id)
);

-- Note: BR-EN-004 logic (ensuring exactly 1 primary contact per active student) is enforced in application code.

-- =============================================================================
-- staff
-- =============================================================================
CREATE TABLE staff (
    id                  UUID NOT NULL DEFAULT gen_random_uuid(),
    staff_number        TEXT NOT NULL,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    other_names         TEXT,
    staff_type          TEXT NOT NULL, -- TEACHING, NON_TEACHING
    ges_registration_no TEXT,
    employment_start    DATE NOT NULL,
    employment_end      DATE,
    status              TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID,
    updated_by          UUID,

    CONSTRAINT pk_staff PRIMARY KEY (id),
    CONSTRAINT uq_staff_number UNIQUE (staff_number),
    CONSTRAINT ck_staff_status CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED'))
);

-- =============================================================================
-- person_documents
-- Generic document attachment for people (students/staff)
-- For MVP, storing binary directly in DB for simplicity.
-- =============================================================================
CREATE TABLE person_documents (
    id             UUID NOT NULL DEFAULT gen_random_uuid(),
    person_id      UUID NOT NULL, -- Logical FK to either students or staff
    person_type    TEXT NOT NULL, -- 'STUDENT', 'STAFF'
    document_type  TEXT NOT NULL, -- 'BIRTH_CERTIFICATE', 'ID', 'QUALIFICATION'
    file_name      TEXT NOT NULL,
    content_type   TEXT NOT NULL,
    file_data      BYTEA NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by     UUID,
    updated_by     UUID,

    CONSTRAINT pk_person_documents PRIMARY KEY (id),
    CONSTRAINT ck_pd_person_type CHECK (person_type IN ('STUDENT', 'STAFF'))
);
