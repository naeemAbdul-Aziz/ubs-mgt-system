-- =============================================================================
-- V11 — Finance (WP-7)
-- fee_schedules, fee_items, invoices, invoice_lines, payments, payment_allocations, adjustments
-- =============================================================================

-- =============================================================================
-- fee_schedules
-- =============================================================================
CREATE TABLE fee_schedules (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    class_level_id   UUID NOT NULL,
    term_id          UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    status           TEXT NOT NULL DEFAULT 'DRAFT',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_fee_schedules PRIMARY KEY (id),
    CONSTRAINT fk_fee_schedules_level FOREIGN KEY (class_level_id) REFERENCES class_levels(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fee_schedules_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fee_schedules_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
    CONSTRAINT uq_fee_schedules_level_term_year UNIQUE (class_level_id, term_id, academic_year_id),
    CONSTRAINT ck_fee_schedules_status CHECK (status IN ('DRAFT', 'APPROVED', 'PUBLISHED'))
);

-- =============================================================================
-- fee_items
-- =============================================================================
CREATE TABLE fee_items (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    fee_schedule_id  UUID NOT NULL,
    description      TEXT NOT NULL,
    amount           DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    is_mandatory     BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_fee_items PRIMARY KEY (id),
    CONSTRAINT fk_fee_items_schedule FOREIGN KEY (fee_schedule_id) REFERENCES fee_schedules(id) ON DELETE CASCADE,
    CONSTRAINT ck_fee_items_amount CHECK (amount >= 0)
);

-- =============================================================================
-- invoices
-- =============================================================================
CREATE TABLE invoices (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    enrollment_id    UUID NOT NULL,
    fee_schedule_id  UUID NOT NULL,
    total_amount     DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    paid_amount      DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    status           TEXT NOT NULL DEFAULT 'DRAFT',
    issue_date       DATE,
    due_date         DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_invoices PRIMARY KEY (id),
    CONSTRAINT fk_invoices_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_invoices_schedule FOREIGN KEY (fee_schedule_id) REFERENCES fee_schedules(id) ON DELETE RESTRICT,
    CONSTRAINT uq_invoices_enrollment_schedule UNIQUE (enrollment_id, fee_schedule_id),
    CONSTRAINT ck_invoices_amounts CHECK (total_amount >= 0 AND paid_amount >= 0 AND paid_amount <= total_amount),
    CONSTRAINT ck_invoices_status CHECK (status IN ('DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'VOID'))
);

-- =============================================================================
-- invoice_lines
-- =============================================================================
CREATE TABLE invoice_lines (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    invoice_id       UUID NOT NULL,
    fee_item_id      UUID NOT NULL,
    amount           DECIMAL(19,4) NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_invoice_lines PRIMARY KEY (id),
    CONSTRAINT fk_invoice_lines_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoice_lines_item FOREIGN KEY (fee_item_id) REFERENCES fee_items(id) ON DELETE RESTRICT,
    CONSTRAINT ck_invoice_lines_amount CHECK (amount >= 0)
);

-- =============================================================================
-- adjustments
-- =============================================================================
CREATE TABLE adjustments (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    invoice_id       UUID NOT NULL,
    amount           DECIMAL(19,4) NOT NULL,
    reason           TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_adjustments PRIMARY KEY (id),
    CONSTRAINT fk_adjustments_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    CONSTRAINT ck_adjustments_amount CHECK (amount > 0),
    CONSTRAINT ck_adjustments_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- =============================================================================
-- payments
-- Immutable receipts (BR-FI-003)
-- =============================================================================
CREATE TABLE payments (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    student_id       UUID NOT NULL,
    receipt_number   TEXT NOT NULL,
    amount           DECIMAL(19,4) NOT NULL,
    payment_date     DATE NOT NULL,
    payment_method   TEXT NOT NULL,
    reference        TEXT,
    is_reversed      BOOLEAN NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_payments PRIMARY KEY (id),
    CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    CONSTRAINT uq_payments_receipt UNIQUE (receipt_number),
    CONSTRAINT ck_payments_amount CHECK (amount > 0),
    CONSTRAINT ck_payments_method CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE'))
);

-- =============================================================================
-- payment_allocations
-- =============================================================================
CREATE TABLE payment_allocations (
    id               UUID NOT NULL DEFAULT gen_random_uuid(),
    payment_id       UUID NOT NULL,
    invoice_id       UUID NOT NULL,
    allocated_amount DECIMAL(19,4) NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID,
    updated_by       UUID,

    CONSTRAINT pk_payment_allocations PRIMARY KEY (id),
    CONSTRAINT fk_pa_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT,
    CONSTRAINT uq_pa_payment_invoice UNIQUE (payment_id, invoice_id),
    CONSTRAINT ck_pa_amount CHECK (allocated_amount > 0)
);
