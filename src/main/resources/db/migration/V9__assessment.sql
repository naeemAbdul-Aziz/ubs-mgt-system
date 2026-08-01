-- V9 — Assessment (WP-6)
-- grade_scales, grade_bands, assessment_components, scores, term_results, report_cards

CREATE TABLE grade_scales (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    name             TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_grade_scales PRIMARY KEY (id),
    CONSTRAINT fk_grade_scales_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    CONSTRAINT uq_grade_scales_year_name UNIQUE (academic_year_id, name)
);

CREATE TABLE grade_bands (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    grade_scale_id   UUID NOT NULL,
    name             TEXT NOT NULL,
    min_score        NUMERIC(5, 2) NOT NULL,
    max_score        NUMERIC(5, 2) NOT NULL,
    point_value      NUMERIC(3, 1) NOT NULL,
    remarks          TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_grade_bands PRIMARY KEY (id),
    CONSTRAINT fk_grade_bands_scale FOREIGN KEY (grade_scale_id) REFERENCES grade_scales(id) ON DELETE CASCADE,
    CONSTRAINT uq_grade_bands_scale_name UNIQUE (grade_scale_id, name),
    CONSTRAINT ck_grade_bands_scores CHECK (max_score >= min_score)
);

CREATE TABLE assessment_components (
    id                          UUID NOT NULL DEFAULT gen_random_uuid(),
    class_subject_offering_id   UUID NOT NULL,
    term_id                     UUID NOT NULL,
    name                        TEXT NOT NULL,
    max_score                   NUMERIC(5, 2) NOT NULL,
    weight                      NUMERIC(5, 2) NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by                  UUID,
    updated_by                  UUID,

    CONSTRAINT pk_assessment_components PRIMARY KEY (id),
    CONSTRAINT fk_ac_cso FOREIGN KEY (class_subject_offering_id) REFERENCES class_subject_offerings(id) ON DELETE CASCADE,
    CONSTRAINT fk_ac_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    CONSTRAINT uq_ac_cso_term_name UNIQUE (class_subject_offering_id, term_id, name),
    CONSTRAINT ck_ac_scores CHECK (max_score > 0 AND weight > 0)
);

CREATE TABLE scores (
    id                        UUID NOT NULL DEFAULT gen_random_uuid(),
    assessment_component_id   UUID NOT NULL,
    enrollment_id             UUID NOT NULL,
    raw_score                 NUMERIC(5, 2),
    is_exempt                 BOOLEAN NOT NULL DEFAULT FALSE,
    is_na                     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by                UUID,
    updated_by                UUID,

    CONSTRAINT pk_scores PRIMARY KEY (id),
    CONSTRAINT fk_scores_ac FOREIGN KEY (assessment_component_id) REFERENCES assessment_components(id) ON DELETE CASCADE,
    CONSTRAINT fk_scores_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT uq_scores_ac_enrollment UNIQUE (assessment_component_id, enrollment_id)
);

CREATE TABLE term_results (
    id                 UUID NOT NULL DEFAULT gen_random_uuid(),
    enrollment_id      UUID NOT NULL,
    term_id            UUID NOT NULL,
    subject_id         UUID NOT NULL,
    sba_total          NUMERIC(5, 2),
    exam_total         NUMERIC(5, 2),
    overall_total      NUMERIC(5, 2),
    grade              TEXT,
    points             NUMERIC(3, 1),
    class_position     INT,
    status             TEXT NOT NULL DEFAULT 'DRAFT',
    version            INT NOT NULL DEFAULT 1,
    superseded_by      UUID,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by         UUID,
    updated_by         UUID,

    CONSTRAINT pk_term_results PRIMARY KEY (id),
    CONSTRAINT fk_term_results_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_term_results_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    CONSTRAINT fk_term_results_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT ck_term_results_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'HOD_APPROVED', 'PUBLISHED'))
);

CREATE TABLE report_cards (
    id                 UUID NOT NULL DEFAULT gen_random_uuid(),
    enrollment_id      UUID NOT NULL,
    term_id            UUID NOT NULL,
    remarks            TEXT,
    published_at       TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by         UUID,
    updated_by         UUID,

    CONSTRAINT pk_report_cards PRIMARY KEY (id),
    CONSTRAINT fk_report_cards_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_cards_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    CONSTRAINT uq_report_cards_enrollment_term UNIQUE (enrollment_id, term_id)
);
