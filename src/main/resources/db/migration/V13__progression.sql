-- =============================================================================
-- V13 — Progression (WP-9)
-- progression_runs, progression_results
-- =============================================================================

-- =============================================================================
-- progression_runs
-- =============================================================================
CREATE TABLE progression_runs (
    id                        UUID NOT NULL DEFAULT gen_random_uuid(),
    source_academic_year_id   UUID NOT NULL,
    target_academic_year_id   UUID,
    status                    TEXT NOT NULL,
    executed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    executed_by               UUID,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by                UUID,
    updated_by                UUID,

    CONSTRAINT pk_progression_runs PRIMARY KEY (id),
    CONSTRAINT ck_progression_runs_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED'))
);

-- =============================================================================
-- progression_results
-- =============================================================================
CREATE TABLE progression_results (
    id                  UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id              UUID NOT NULL,
    student_id          UUID NOT NULL,
    final_average       DECIMAL(5,2),
    outcome             TEXT NOT NULL,
    previous_class_id   UUID NOT NULL,
    new_enrollment_id   UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID,
    updated_by          UUID,

    CONSTRAINT pk_progression_results PRIMARY KEY (id),
    CONSTRAINT fk_pr_run FOREIGN KEY (run_id) REFERENCES progression_runs(id) ON DELETE CASCADE,
    CONSTRAINT ck_pr_outcome CHECK (outcome IN ('PROMOTED', 'REPEATED', 'GRADUATED', 'WITHDRAWN'))
);
