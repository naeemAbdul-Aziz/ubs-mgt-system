-- =============================================================================
-- V23 — Provision remaining student accounts (STD-26-003, STD-26-004)
-- STD-26-001 and STD-26-002 were seeded in V15.
-- This migration completes the student roster so every enrolled student
-- has a unique, production-ready login credential.
--
-- Username convention : student_number  (e.g. STD-26-003)
-- Default password    : Password123     (BCrypt hash below)
-- must_change_password: true  ← enforced at first login
-- =============================================================================

DO $$
DECLARE
    v_student_role UUID;
    v_student_3    UUID;
    v_student_4    UUID;

    -- BCrypt hash for 'Password123'
    v_default_hash TEXT := '$2b$12$SeZvAenYvq/q6fOZw1SyMOFbkqDZZHLYHqHUFB9I/lmFRsNxxYb6y';
BEGIN
    -- Resolve role and person IDs from existing data
    SELECT id INTO v_student_role FROM roles WHERE name = 'STUDENT';
    SELECT id INTO v_student_3    FROM students WHERE student_number = 'STD-26-003';
    SELECT id INTO v_student_4    FROM students WHERE student_number = 'STD-26-004';

    IF v_student_role IS NULL THEN
        RAISE EXCEPTION 'STUDENT role not found — ensure V3 ran successfully';
    END IF;

    IF v_student_3 IS NULL THEN
        RAISE EXCEPTION 'Student STD-26-003 not found — ensure V15 ran successfully';
    END IF;

    IF v_student_4 IS NULL THEN
        RAISE EXCEPTION 'Student STD-26-004 not found — ensure V15 ran successfully';
    END IF;

    -- Insert accounts (idempotent: skip if already exists)
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT gen_random_uuid(), 'STD-26-003', v_default_hash, 'STUDENT', v_student_3, 'ACTIVE', true
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'STD-26-003');

    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT gen_random_uuid(), 'STD-26-004', v_default_hash, 'STUDENT', v_student_4, 'ACTIVE', true
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'STD-26-004');

    -- Assign STUDENT role to both new accounts
    INSERT INTO account_roles (account_id, role_id)
    SELECT a.id, v_student_role
    FROM accounts a
    WHERE a.username IN ('STD-26-003', 'STD-26-004')
      AND NOT EXISTS (
          SELECT 1 FROM account_roles ar WHERE ar.account_id = a.id AND ar.role_id = v_student_role
      );

    RAISE NOTICE 'Student accounts provisioned: STD-26-003, STD-26-004';
END $$;
