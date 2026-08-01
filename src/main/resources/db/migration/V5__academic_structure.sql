-- =============================================================================
-- V5 — Academic Structure
-- academic_years, terms, term_calendar_variants, classes, class_subject_offerings
-- =============================================================================

-- =============================================================================
-- academic_years
-- =============================================================================
CREATE TABLE academic_years (
    id          UUID NOT NULL DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL, -- e.g., '2026/2027'
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    status      TEXT NOT NULL DEFAULT 'PLANNED',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_academic_years PRIMARY KEY (id),
    CONSTRAINT uq_academic_years_name UNIQUE (name),
    CONSTRAINT ck_academic_years_status CHECK (status IN ('PLANNED', 'ACTIVE', 'CLOSED')),
    CONSTRAINT ck_academic_years_dates CHECK (end_date > start_date)
);

-- Ensure only one ACTIVE year at a time
CREATE UNIQUE INDEX uq_idx_active_academic_year ON academic_years (status) WHERE status = 'ACTIVE';

-- =============================================================================
-- terms
-- =============================================================================
CREATE TABLE terms (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    term_number      INT  NOT NULL, -- 1, 2, or 3
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_terms PRIMARY KEY (id),
    CONSTRAINT fk_terms_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    CONSTRAINT uq_terms_number UNIQUE (academic_year_id, term_number),
    CONSTRAINT ck_terms_number CHECK (term_number IN (1, 2, 3)),
    CONSTRAINT ck_terms_dates CHECK (end_date > start_date)
);

-- =============================================================================
-- term_calendar_variants
-- For level-specific term dates (e.g. JHS 3 ends early)
-- =============================================================================
CREATE TABLE term_calendar_variants (
    id             UUID NOT NULL DEFAULT gen_random_uuid(),
    term_id        UUID NOT NULL,
    class_level_id UUID NOT NULL,
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by     UUID,
    updated_by     UUID,

    CONSTRAINT pk_term_calendar_variants PRIMARY KEY (id),
    CONSTRAINT fk_tcv_term  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    CONSTRAINT fk_tcv_level FOREIGN KEY (class_level_id) REFERENCES class_levels(id) ON DELETE CASCADE,
    CONSTRAINT uq_tcv_term_level UNIQUE (term_id, class_level_id),
    CONSTRAINT ck_tcv_dates CHECK (end_date > start_date)
);

-- =============================================================================
-- classes
-- e.g., Primary 3A. Instantiated per year. Capacity is fixed per class.
-- =============================================================================
CREATE TABLE classes (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    class_level_id   UUID NOT NULL,
    stream           TEXT NOT NULL, -- e.g., 'A', 'B', 'C', 'Gold', 'Silver'
    capacity         INT  NOT NULL DEFAULT 35,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_classes PRIMARY KEY (id),
    CONSTRAINT fk_classes_year  FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    CONSTRAINT fk_classes_level FOREIGN KEY (class_level_id) REFERENCES class_levels(id) ON DELETE RESTRICT,
    CONSTRAINT uq_classes_year_level_stream UNIQUE (academic_year_id, class_level_id, stream),
    CONSTRAINT ck_classes_capacity CHECK (capacity > 0)
);

-- =============================================================================
-- class_subject_offerings
-- What is taught in a specific class for the year
-- =============================================================================
CREATE TABLE class_subject_offerings (
    id         UUID NOT NULL DEFAULT gen_random_uuid(),
    class_id   UUID NOT NULL,
    subject_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,

    CONSTRAINT pk_class_subject_offerings PRIMARY KEY (id),
    CONSTRAINT fk_cso_class   FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_cso_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
    CONSTRAINT uq_cso_class_subject UNIQUE (class_id, subject_id)
);
