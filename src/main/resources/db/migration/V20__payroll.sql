-- =============================================================================
-- V20 — Payroll & Staff Payments
-- salary_structures, payroll_runs, payslips
-- =============================================================================

-- =============================================================================
-- salary_structures
-- Defines the base salary and standard allowances/deductions for staff
-- =============================================================================
CREATE TABLE salary_structures (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    staff_id         UUID NOT NULL,
    base_salary      DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    tax_percentage   DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    allowances       DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_salary_structures PRIMARY KEY (id),
    CONSTRAINT fk_ss_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    CONSTRAINT uq_ss_staff UNIQUE (staff_id),
    CONSTRAINT ck_ss_base_salary CHECK (base_salary >= 0)
);

-- =============================================================================
-- payroll_runs
-- Batch processing for a specific month and year
-- =============================================================================
CREATE TABLE payroll_runs (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    month            INTEGER NOT NULL,
    year             INTEGER NOT NULL,
    status           TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, APPROVED, PROCESSED
    total_amount     DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    run_date         DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_payroll_runs PRIMARY KEY (id),
    CONSTRAINT uq_pr_month_year UNIQUE (month, year),
    CONSTRAINT ck_pr_status CHECK (status IN ('DRAFT', 'APPROVED', 'PROCESSED'))
);

-- =============================================================================
-- payslips
-- Individual staff earnings per payroll run
-- =============================================================================
CREATE TABLE payslips (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    payroll_run_id   UUID NOT NULL,
    staff_id         UUID NOT NULL,
    base_salary      DECIMAL(19,4) NOT NULL,
    allowances       DECIMAL(19,4) NOT NULL,
    tax_deductions   DECIMAL(19,4) NOT NULL,
    net_pay          DECIMAL(19,4) NOT NULL,
    status           TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, PAID
    payment_date     DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_payslips PRIMARY KEY (id),
    CONSTRAINT fk_ps_run FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
    CONSTRAINT fk_ps_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE RESTRICT,
    CONSTRAINT uq_ps_run_staff UNIQUE (payroll_run_id, staff_id),
    CONSTRAINT ck_ps_status CHECK (status IN ('DRAFT', 'PAID'))
);
