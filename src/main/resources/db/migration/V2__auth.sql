-- =============================================================================
-- V2 — Authentication
-- accounts, roles, permissions, join tables, refresh_tokens, login_attempts
-- =============================================================================

-- =============================================================================
-- permissions — Fine-grained permission catalog (doc 14 §6)
-- Seeded in V3; this table is extended by migration, never edited in place.
-- =============================================================================
CREATE TABLE permissions (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    code        TEXT        NOT NULL,   -- e.g. 'STUDENT_CREATE', 'RESULT_PUBLISH'
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_permissions PRIMARY KEY (id),
    CONSTRAINT uq_permissions_code UNIQUE (code),
    CONSTRAINT ck_permissions_code_format CHECK (code ~ '^[A-Z][A-Z0-9_]+$')
);

COMMENT ON TABLE permissions IS 'Fine-grained permission catalog. Seeded by migration; extended by new migrations only — never edited in place.';

-- =============================================================================
-- roles — Named bundles of permissions (doc 03 §2)
-- =============================================================================
CREATE TABLE roles (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_roles_name UNIQUE (name),
    CONSTRAINT ck_roles_name_valid CHECK (name IN (
        'SYSTEM_ADMIN', 'HEAD_OF_SCHOOL', 'SCHOOL_ADMIN', 'HOD',
        'TEACHER', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'GUARDIAN', 'STUDENT'
    ))
);

COMMENT ON TABLE roles IS 'Named bundles of permissions. Users hold roles; endpoints check permissions.';

-- =============================================================================
-- role_permissions — Many-to-many: role ↔ permission
-- =============================================================================
CREATE TABLE role_permissions (
    role_id       UUID NOT NULL,
    permission_id UUID NOT NULL,

    CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- =============================================================================
-- accounts — User accounts (ADR-004: account ≠ person)
-- =============================================================================
CREATE TABLE accounts (
    id                   UUID        NOT NULL DEFAULT gen_random_uuid(),
    username             TEXT        NOT NULL,
    password_hash        TEXT        NOT NULL,
    person_type          TEXT        NOT NULL,  -- 'STAFF' | 'GUARDIAN' | 'STUDENT'
    person_id            UUID        NOT NULL,  -- cross-module ref; no DB FK
    status               TEXT        NOT NULL DEFAULT 'ACTIVE',
    must_change_password BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by           UUID,
    updated_by           UUID,

    CONSTRAINT pk_accounts PRIMARY KEY (id),
    CONSTRAINT uq_accounts_username UNIQUE (username),
    CONSTRAINT ck_accounts_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_accounts_person_type CHECK (person_type IN ('STAFF', 'GUARDIAN', 'STUDENT'))
);

COMMENT ON TABLE accounts IS 'Authentication accounts. Account ≠ Person (ADR-004). Accounts are provisioned; never self-registered (BR-SE-003).';
COMMENT ON COLUMN accounts.person_id IS 'Cross-module reference to Staff/Guardian/Student. No DB FK — audit outlives person records.';

-- =============================================================================
-- account_roles — Many-to-many: account ↔ role
-- =============================================================================
CREATE TABLE account_roles (
    account_id UUID NOT NULL,
    role_id    UUID NOT NULL,

    CONSTRAINT pk_account_roles PRIMARY KEY (account_id, role_id),
    CONSTRAINT fk_ar_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_role    FOREIGN KEY (role_id)    REFERENCES roles(id)    ON DELETE RESTRICT
);

-- =============================================================================
-- refresh_tokens — Server-persisted hashed refresh tokens
-- =============================================================================
CREATE TABLE refresh_tokens (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    account_id      UUID        NOT NULL,
    token_hash      TEXT        NOT NULL,   -- SHA-256 hex; raw token never stored
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,            -- NULL = still valid
    issued_from_ip  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,

    CONSTRAINT pk_refresh_tokens PRIMARY KEY (id),
    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash),
    CONSTRAINT fk_rt_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_account ON refresh_tokens (account_id) WHERE revoked_at IS NULL;

COMMENT ON TABLE  refresh_tokens IS 'Hashed refresh tokens enabling revocation. Raw token is never persisted.';
COMMENT ON COLUMN refresh_tokens.token_hash IS 'SHA-256 hex of the raw token value.';

-- =============================================================================
-- login_attempts — For lockout enforcement (FR-AUTH-05)
-- =============================================================================
CREATE TABLE login_attempts (
    id           UUID        NOT NULL DEFAULT gen_random_uuid(),
    account_id   UUID,        -- NULL for attempts against unknown usernames
    username     TEXT        NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    success      BOOLEAN     NOT NULL,
    ip_address   TEXT,

    CONSTRAINT pk_login_attempts PRIMARY KEY (id)
);

CREATE INDEX idx_login_attempts_account_recent
    ON login_attempts (account_id, attempted_at DESC)
    WHERE account_id IS NOT NULL AND success = FALSE;

COMMENT ON TABLE login_attempts IS 'Login attempt log for lockout enforcement (FR-AUTH-05) and security audit.';
