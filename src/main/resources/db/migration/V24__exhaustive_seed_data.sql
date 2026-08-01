-- =============================================================================
-- V24 — Exhaustive E2E Seed Data (All Actors + Full Coverage)
-- Provisions all missing actor accounts and enriches every domain with
-- test data so the system can be walked end-to-end by any actor.
--
-- Actor Credentials (all passwords: Password123)
-- ─────────────────────────────────────────────
--  sys.admin        → SYSTEM_ADMIN  (STAFF)
--  kwame.osei       → HEAD_OF_SCHOOL (already seeded V15)
--  admin.sekyi      → SCHOOL_ADMIN  (STAFF)
--  kofi.owusu       → HOD           (STAFF, STF-003 promoted)
--  ama.mensah       → TEACHER       (already seeded V15)
--  kojo.appiah      → ACCOUNTANT    (already seeded V15)
--  adwoa.librarian  → LIBRARIAN     (STAFF)
--  abena.nurse      → NURSE         (STAFF)
--  samuel.frimpong  → GUARDIAN      (already seeded V15)
--  mary.agyeman     → GUARDIAN      (GUARDIAN — was missing account)
--  STD-26-001..004  → STUDENT       (seeded V15 + V23)
-- =============================================================================

DO $$
DECLARE
    -- Roles
    v_head_role      UUID;
    v_admin_role     UUID;
    v_hod_role       UUID;
    v_teacher_role   UUID;
    v_accountant_role UUID;
    v_librarian_role UUID;
    v_nurse_role     UUID;
    v_guardian_role  UUID;
    v_student_role   UUID;
    v_sysadmin_role  UUID;

    -- Existing staff (from V15)
    v_staff_head     UUID;
    v_staff_t1       UUID;  -- ama.mensah (Teacher)
    v_staff_t2       UUID;  -- kofi.owusu → promoted to HOD
    v_staff_acct     UUID;

    -- New staff
    v_staff_school_admin UUID := gen_random_uuid();
    v_staff_librarian    UUID := gen_random_uuid();
    v_staff_nurse        UUID := gen_random_uuid();

    -- Existing guardian 2 (from V15, no account)
    v_guardian_2     UUID;

    -- Academic refs
    v_year_2627      UUID;
    v_term1_2627     UUID;
    v_term2_2627     UUID;
    v_term3_2627     UUID;
    v_level_p1       UUID;
    v_level_p3       UUID;
    v_level_jhs1     UUID;
    v_class_p1a      UUID;
    v_class_p3a      UUID;
    v_class_jhs1a    UUID;
    v_dept_prim      UUID;
    v_dept_jhs       UUID;

    -- Students & Enrollments
    v_student_1 UUID;
    v_student_2 UUID;
    v_student_3 UUID;
    v_student_4 UUID;
    v_enr_1 UUID;
    v_enr_2 UUID;
    v_enr_3 UUID;
    v_enr_4 UUID;

    -- Subjects
    v_subj_eng  UUID;
    v_subj_math UUID;
    v_subj_sci  UUID;

    -- Existing class-subject offerings (P1A)
    v_cso_p1a_eng  UUID;
    v_cso_p1a_math UUID;

    -- New class-subject offerings (P3A, JHS1A)
    v_cso_p3a_eng  UUID := gen_random_uuid();
    v_cso_p3a_math UUID := gen_random_uuid();
    v_cso_p3a_sci  UUID := gen_random_uuid();
    v_cso_jhs1a_eng  UUID := gen_random_uuid();
    v_cso_jhs1a_math UUID := gen_random_uuid();
    v_cso_jhs1a_sci  UUID := gen_random_uuid();

    -- Assessment components (P3A, JHS1A)
    v_ac_p3a_eng_sba   UUID := gen_random_uuid();
    v_ac_p3a_eng_exam  UUID := gen_random_uuid();
    v_ac_p3a_math_sba  UUID := gen_random_uuid();
    v_ac_p3a_math_exam UUID := gen_random_uuid();
    v_ac_jhs1_eng_sba   UUID := gen_random_uuid();
    v_ac_jhs1_eng_exam  UUID := gen_random_uuid();
    v_ac_jhs1_math_sba  UUID := gen_random_uuid();
    v_ac_jhs1_math_exam UUID := gen_random_uuid();

    -- Finance for STD-26-003 and STD-26-004
    v_fee_sched_p3   UUID := gen_random_uuid();
    v_fee_sched_jhs1 UUID := gen_random_uuid();
    v_fee_item_p3_tuition  UUID := gen_random_uuid();
    v_fee_item_p3_feeding  UUID := gen_random_uuid();
    v_fee_item_jhs_tuition UUID := gen_random_uuid();
    v_fee_item_jhs_feeding UUID := gen_random_uuid();
    v_inv_3  UUID := gen_random_uuid();
    v_inv_4  UUID := gen_random_uuid();
    v_pay_3  UUID := gen_random_uuid();

    -- New auth accounts
    v_acct_sysadmin      UUID := gen_random_uuid();
    v_acct_school_admin  UUID := gen_random_uuid();
    v_acct_hod           UUID := gen_random_uuid();
    v_acct_t2            UUID;  -- kofi.owusu's existing account gets HOD role added
    v_acct_librarian     UUID := gen_random_uuid();
    v_acct_nurse         UUID := gen_random_uuid();
    v_acct_g2            UUID := gen_random_uuid();

    -- Password hash for 'Password123'
    v_hash TEXT := '$2b$12$SeZvAenYvq/q6fOZw1SyMOFbkqDZZHLYHqHUFB9I/lmFRsNxxYb6y';

    -- Notification outbox (no extra vars needed)
    v_dummy TEXT; -- placeholder to avoid empty declaration warning

BEGIN

    ---------------------------------------------------------------------------
    -- 0. Resolve existing reference data
    ---------------------------------------------------------------------------
    SELECT id INTO v_sysadmin_role   FROM roles WHERE name = 'SYSTEM_ADMIN';
    SELECT id INTO v_head_role       FROM roles WHERE name = 'HEAD_OF_SCHOOL';
    SELECT id INTO v_admin_role      FROM roles WHERE name = 'SCHOOL_ADMIN';
    SELECT id INTO v_hod_role        FROM roles WHERE name = 'HOD';
    SELECT id INTO v_teacher_role    FROM roles WHERE name = 'TEACHER';
    SELECT id INTO v_accountant_role FROM roles WHERE name = 'ACCOUNTANT';
    SELECT id INTO v_librarian_role  FROM roles WHERE name = 'LIBRARIAN';
    SELECT id INTO v_nurse_role      FROM roles WHERE name = 'NURSE';
    SELECT id INTO v_guardian_role   FROM roles WHERE name = 'GUARDIAN';
    SELECT id INTO v_student_role    FROM roles WHERE name = 'STUDENT';

    SELECT id INTO v_staff_head  FROM staff WHERE staff_number = 'STF-001';
    SELECT id INTO v_staff_t1    FROM staff WHERE staff_number = 'STF-002';
    SELECT id INTO v_staff_t2    FROM staff WHERE staff_number = 'STF-003';
    SELECT id INTO v_staff_acct  FROM staff WHERE staff_number = 'STF-004';

    SELECT id INTO v_guardian_2 FROM guardians WHERE email = 'mary.agyeman@example.com';

    SELECT id INTO v_year_2627   FROM academic_years WHERE name = '2026/2027';
    SELECT id INTO v_term1_2627  FROM terms WHERE academic_year_id = v_year_2627 AND term_number = 1;
    SELECT id INTO v_term2_2627  FROM terms WHERE academic_year_id = v_year_2627 AND term_number = 2;
    SELECT id INTO v_term3_2627  FROM terms WHERE academic_year_id = v_year_2627 AND term_number = 3;

    SELECT id INTO v_dept_prim FROM departments WHERE code = 'PRIMARY';
    SELECT id INTO v_dept_jhs  FROM departments WHERE code = 'JHS';

    SELECT id INTO v_level_p1   FROM class_levels WHERE code = 'P1';
    SELECT id INTO v_level_p3   FROM class_levels WHERE code = 'P3';
    SELECT id INTO v_level_jhs1 FROM class_levels WHERE code = 'JHS1';

    SELECT id INTO v_subj_eng  FROM subjects WHERE code = 'ENG';
    SELECT id INTO v_subj_math FROM subjects WHERE code = 'MATH';
    SELECT id INTO v_subj_sci  FROM subjects WHERE code = 'SCI';

    SELECT id INTO v_student_1 FROM students WHERE student_number = 'STD-26-001';
    SELECT id INTO v_student_2 FROM students WHERE student_number = 'STD-26-002';
    SELECT id INTO v_student_3 FROM students WHERE student_number = 'STD-26-003';
    SELECT id INTO v_student_4 FROM students WHERE student_number = 'STD-26-004';

    SELECT id INTO v_enr_1 FROM enrollments WHERE student_id = v_student_1;
    SELECT id INTO v_enr_2 FROM enrollments WHERE student_id = v_student_2;
    SELECT id INTO v_enr_3 FROM enrollments WHERE student_id = v_student_3;
    SELECT id INTO v_enr_4 FROM enrollments WHERE student_id = v_student_4;

    SELECT id INTO v_class_p1a   FROM classes WHERE academic_year_id = v_year_2627 AND stream = 'A' AND class_level_id = v_level_p1;
    SELECT id INTO v_class_p3a   FROM classes WHERE academic_year_id = v_year_2627 AND stream = 'A' AND class_level_id = v_level_p3;
    SELECT id INTO v_class_jhs1a FROM classes WHERE academic_year_id = v_year_2627 AND stream = 'A' AND class_level_id = v_level_jhs1;

    SELECT id INTO v_cso_p1a_eng  FROM class_subject_offerings WHERE class_id = v_class_p1a AND subject_id = v_subj_eng;
    SELECT id INTO v_cso_p1a_math FROM class_subject_offerings WHERE class_id = v_class_p1a AND subject_id = v_subj_math;

    -- kofi.owusu's existing account (STF-003 — previously just TEACHER)
    SELECT id INTO v_acct_t2 FROM accounts WHERE username = 'kofi.owusu';

    ---------------------------------------------------------------------------
    -- 1. NEW STAFF PEOPLE (School Admin, Librarian, Nurse)
    ---------------------------------------------------------------------------
    INSERT INTO staff (id, staff_number, first_name, last_name, staff_type, employment_start, status)
    VALUES
        (v_staff_school_admin, 'STF-005', 'Akua',   'Sekyi',   'NON_TEACHING', '2022-01-10', 'ACTIVE'),
        (v_staff_librarian,    'STF-006', 'Adwoa',  'Boateng', 'NON_TEACHING', '2023-09-01', 'ACTIVE'),
        (v_staff_nurse,        'STF-007', 'Abena',  'Asante',  'NON_TEACHING', '2021-03-15', 'ACTIVE');

    ---------------------------------------------------------------------------
    -- 2. NEW AUTH ACCOUNTS — missing actors
    ---------------------------------------------------------------------------

    -- SYSTEM_ADMIN (maps to Head's staff record for data purposes)
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT v_acct_sysadmin, 'sys.admin', v_hash, 'STAFF', v_staff_head, 'ACTIVE', false
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'sys.admin');
    INSERT INTO account_roles (account_id, role_id)
    SELECT v_acct_sysadmin, v_sysadmin_role
    WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_sysadmin AND role_id = v_sysadmin_role);

    -- SCHOOL_ADMIN
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT v_acct_school_admin, 'admin.sekyi', v_hash, 'STAFF', v_staff_school_admin, 'ACTIVE', false
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'admin.sekyi');
    INSERT INTO account_roles (account_id, role_id)
    SELECT v_acct_school_admin, v_admin_role
    WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_school_admin AND role_id = v_admin_role);

    -- HOD — add HOD role to kofi.owusu's existing account (and remove TEACHER if needed — he's now HOD)
    IF v_acct_t2 IS NOT NULL THEN
        -- Add HOD role
        INSERT INTO account_roles (account_id, role_id)
        SELECT v_acct_t2, v_hod_role
        WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_t2 AND role_id = v_hod_role);
        -- Keep TEACHER role too (HOD is also a teacher in Ghanaian schools)
    END IF;

    -- LIBRARIAN
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT v_acct_librarian, 'adwoa.librarian', v_hash, 'STAFF', v_staff_librarian, 'ACTIVE', false
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'adwoa.librarian');
    INSERT INTO account_roles (account_id, role_id)
    SELECT v_acct_librarian, v_librarian_role
    WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_librarian AND role_id = v_librarian_role);

    -- NURSE
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT v_acct_nurse, 'abena.nurse', v_hash, 'STAFF', v_staff_nurse, 'ACTIVE', false
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'abena.nurse');
    INSERT INTO account_roles (account_id, role_id)
    SELECT v_acct_nurse, v_nurse_role
    WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_nurse AND role_id = v_nurse_role);

    -- GUARDIAN 2 (Mary Agyeman — had person record but no account)
    INSERT INTO accounts (id, username, password_hash, person_type, person_id, status, must_change_password)
    SELECT v_acct_g2, 'mary.agyeman', v_hash, 'GUARDIAN', v_guardian_2, 'ACTIVE', false
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'mary.agyeman');
    INSERT INTO account_roles (account_id, role_id)
    SELECT v_acct_g2, v_guardian_role
    WHERE NOT EXISTS (SELECT 1 FROM account_roles WHERE account_id = v_acct_g2 AND role_id = v_guardian_role);

    -- Also link student 4 (Grace Addo) to guardian 2 if missing
    INSERT INTO student_guardians (student_id, guardian_id, relationship_type, is_primary_contact, receives_billing, receives_academic_reports)
    SELECT v_student_4, v_guardian_2, 'MOTHER', true, true, true
    WHERE NOT EXISTS (SELECT 1 FROM student_guardians WHERE student_id = v_student_4 AND guardian_id = v_guardian_2);

    ---------------------------------------------------------------------------
    -- 3. SUBJECT OFFERINGS for P3A and JHS1A classes
    ---------------------------------------------------------------------------
    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_p3a_eng, v_class_p3a, v_subj_eng
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_p3a AND subject_id = v_subj_eng);

    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_p3a_math, v_class_p3a, v_subj_math
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_p3a AND subject_id = v_subj_math);

    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_p3a_sci, v_class_p3a, v_subj_sci
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_p3a AND subject_id = v_subj_sci);

    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_jhs1a_eng, v_class_jhs1a, v_subj_eng
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_eng);

    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_jhs1a_math, v_class_jhs1a, v_subj_math
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_math);

    INSERT INTO class_subject_offerings (id, class_id, subject_id)
    SELECT v_cso_jhs1a_sci, v_class_jhs1a, v_subj_sci
    WHERE NOT EXISTS (SELECT 1 FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_sci);

    -- Re-resolve in case they already existed
    SELECT id INTO v_cso_p3a_eng  FROM class_subject_offerings WHERE class_id = v_class_p3a   AND subject_id = v_subj_eng;
    SELECT id INTO v_cso_p3a_math FROM class_subject_offerings WHERE class_id = v_class_p3a   AND subject_id = v_subj_math;
    SELECT id INTO v_cso_p3a_sci  FROM class_subject_offerings WHERE class_id = v_class_p3a   AND subject_id = v_subj_sci;
    SELECT id INTO v_cso_jhs1a_eng  FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_eng;
    SELECT id INTO v_cso_jhs1a_math FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_math;
    SELECT id INTO v_cso_jhs1a_sci  FROM class_subject_offerings WHERE class_id = v_class_jhs1a AND subject_id = v_subj_sci;

    ---------------------------------------------------------------------------
    -- 4. TEACHER ASSIGNMENTS — Assign kofi.owusu (HOD/Teacher) to P3A and JHS1A
    ---------------------------------------------------------------------------
    -- Class teachers
    UPDATE classes SET class_teacher_id = v_staff_t2
    WHERE id = v_class_p3a AND class_teacher_id IS NULL;

    UPDATE classes SET class_teacher_id = v_staff_t2
    WHERE id = v_class_jhs1a AND class_teacher_id IS NULL;

    -- Also assign ama.mensah to P1A as class teacher if not done
    UPDATE classes SET class_teacher_id = v_staff_t1
    WHERE id = v_class_p1a AND class_teacher_id IS NULL;

    ---------------------------------------------------------------------------
    -- 5. EXTENDED ATTENDANCE (full week for all students)
    ---------------------------------------------------------------------------
    -- Week 2 attendance for STD-26-001 and STD-26-002 (P1A)
    INSERT INTO attendance_records (enrollment_id, attendance_date, status, marked_by)
    SELECT v_enr_1, dates.d, 'PRESENT', v_staff_t1
    FROM (VALUES ('2026-09-07'::date), ('2026-09-08'), ('2026-09-09'), ('2026-09-10'), ('2026-09-11')) AS dates(d)
    WHERE NOT EXISTS (SELECT 1 FROM attendance_records WHERE enrollment_id = v_enr_1 AND attendance_date = dates.d);

    INSERT INTO attendance_records (enrollment_id, attendance_date, status, marked_by)
    SELECT v_enr_2, dates.d, s.status, v_staff_t1
    FROM (VALUES ('2026-09-07'::date, 'PRESENT'), ('2026-09-08', 'ABSENT'), ('2026-09-09', 'PRESENT'), ('2026-09-10', 'PRESENT'), ('2026-09-11', 'LATE')) AS dates(d, status)
    CROSS JOIN LATERAL (SELECT dates.status) s
    WHERE NOT EXISTS (SELECT 1 FROM attendance_records WHERE enrollment_id = v_enr_2 AND attendance_date = dates.d);

    -- STD-26-003 attendance (P3A)
    INSERT INTO attendance_records (enrollment_id, attendance_date, status, marked_by)
    SELECT v_enr_3, dates.d, s.status, v_staff_t2
    FROM (VALUES
        ('2026-09-02'::date, 'PRESENT'), ('2026-09-03', 'PRESENT'), ('2026-09-04', 'PRESENT'),
        ('2026-09-07', 'ABSENT'), ('2026-09-08', 'PRESENT'), ('2026-09-09', 'PRESENT'),
        ('2026-09-10', 'PRESENT'), ('2026-09-11', 'PRESENT')
    ) AS dates(d, status)
    CROSS JOIN LATERAL (SELECT dates.status) s
    WHERE NOT EXISTS (SELECT 1 FROM attendance_records WHERE enrollment_id = v_enr_3 AND attendance_date = dates.d);

    -- STD-26-004 attendance (JHS1A)
    INSERT INTO attendance_records (enrollment_id, attendance_date, status, marked_by)
    SELECT v_enr_4, dates.d, s.status, v_staff_t2
    FROM (VALUES
        ('2026-09-02'::date, 'PRESENT'), ('2026-09-03', 'PRESENT'), ('2026-09-04', 'LATE'),
        ('2026-09-07', 'PRESENT'), ('2026-09-08', 'PRESENT'), ('2026-09-09', 'ABSENT'),
        ('2026-09-10', 'PRESENT'), ('2026-09-11', 'PRESENT')
    ) AS dates(d, status)
    CROSS JOIN LATERAL (SELECT dates.status) s
    WHERE NOT EXISTS (SELECT 1 FROM attendance_records WHERE enrollment_id = v_enr_4 AND attendance_date = dates.d);

    ---------------------------------------------------------------------------
    -- 6. ASSESSMENT COMPONENTS + SCORES for P3A and JHS1A (Term 1)
    ---------------------------------------------------------------------------
    -- P3A Assessment Components
    INSERT INTO assessment_components (id, class_subject_offering_id, term_id, name, max_score, weight) VALUES
        (v_ac_p3a_eng_sba,   v_cso_p3a_eng,  v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_p3a_eng_exam,  v_cso_p3a_eng,  v_term1_2627, 'End of Term Exam',        100, 70),
        (v_ac_p3a_math_sba,  v_cso_p3a_math, v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_p3a_math_exam, v_cso_p3a_math, v_term1_2627, 'End of Term Exam',        100, 70)
    ON CONFLICT DO NOTHING;

    -- JHS1A Assessment Components
    INSERT INTO assessment_components (id, class_subject_offering_id, term_id, name, max_score, weight) VALUES
        (v_ac_jhs1_eng_sba,   v_cso_jhs1a_eng,  v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_jhs1_eng_exam,  v_cso_jhs1a_eng,  v_term1_2627, 'End of Term Exam',        100, 70),
        (v_ac_jhs1_math_sba,  v_cso_jhs1a_math, v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_jhs1_math_exam, v_cso_jhs1a_math, v_term1_2627, 'End of Term Exam',        100, 70)
    ON CONFLICT DO NOTHING;

    -- Scores for STD-26-003 (Daniel Agyeman, P3A)
    INSERT INTO scores (assessment_component_id, enrollment_id, raw_score) VALUES
        (v_ac_p3a_eng_sba,   v_enr_3, 72.00),
        (v_ac_p3a_eng_exam,  v_enr_3, 68.00),
        (v_ac_p3a_math_sba,  v_enr_3, 65.00),
        (v_ac_p3a_math_exam, v_enr_3, 58.00)
    ON CONFLICT DO NOTHING;

    -- Scores for STD-26-004 (Grace Addo, JHS1A)
    INSERT INTO scores (assessment_component_id, enrollment_id, raw_score) VALUES
        (v_ac_jhs1_eng_sba,   v_enr_4, 88.00),
        (v_ac_jhs1_eng_exam,  v_enr_4, 82.00),
        (v_ac_jhs1_math_sba,  v_enr_4, 91.00),
        (v_ac_jhs1_math_exam, v_enr_4, 87.00)
    ON CONFLICT DO NOTHING;

    -- Term Results for STD-26-003
    INSERT INTO term_results (enrollment_id, term_id, subject_id, sba_total, exam_total, overall_total, grade, status) VALUES
        (v_enr_3, v_term1_2627, v_subj_eng,  21.6, 47.6, 69.2, 'C', 'PUBLISHED'),
        (v_enr_3, v_term1_2627, v_subj_math, 19.5, 40.6, 60.1, 'C', 'PUBLISHED')
    ON CONFLICT DO NOTHING;

    -- Term Results for STD-26-004
    INSERT INTO term_results (enrollment_id, term_id, subject_id, sba_total, exam_total, overall_total, grade, status) VALUES
        (v_enr_4, v_term1_2627, v_subj_eng,  26.4, 57.4, 83.8, 'A', 'PUBLISHED'),
        (v_enr_4, v_term1_2627, v_subj_math, 27.3, 60.9, 88.2, 'A', 'PUBLISHED')
    ON CONFLICT DO NOTHING;

    -- Report Cards for STD-26-003 and STD-26-004
    INSERT INTO report_cards (id, enrollment_id, term_id, remarks, published_at)
    VALUES
        (gen_random_uuid(), v_enr_3, v_term1_2627, 'Daniel shows steady progress. Encourage more reading at home.', NOW())
    ON CONFLICT (enrollment_id, term_id) DO NOTHING;

    INSERT INTO report_cards (id, enrollment_id, term_id, remarks, published_at)
    VALUES
        (gen_random_uuid(), v_enr_4, v_term1_2627, 'Grace is an outstanding student. Excellent attitude and performance this term.', NOW())
    ON CONFLICT (enrollment_id, term_id) DO NOTHING;

    ---------------------------------------------------------------------------
    -- 7. FEE SCHEDULES & INVOICES for all students
    ---------------------------------------------------------------------------
    -- Fee schedule for P3A
    INSERT INTO fee_schedules (id, class_level_id, term_id, academic_year_id, status)
    SELECT v_fee_sched_p3, v_level_p3, v_term1_2627, v_year_2627, 'PUBLISHED'
    WHERE NOT EXISTS (SELECT 1 FROM fee_schedules WHERE class_level_id = v_level_p3 AND term_id = v_term1_2627);

    INSERT INTO fee_items (id, fee_schedule_id, description, amount, is_mandatory)
    SELECT v_fee_item_p3_tuition, v_fee_sched_p3, 'Tuition Fee',  900.00, true  WHERE NOT EXISTS (SELECT 1 FROM fee_items WHERE id = v_fee_item_p3_tuition);
    INSERT INTO fee_items (id, fee_schedule_id, description, amount, is_mandatory)
    SELECT v_fee_item_p3_feeding, v_fee_sched_p3, 'Feeding Fee',  350.00, false WHERE NOT EXISTS (SELECT 1 FROM fee_items WHERE id = v_fee_item_p3_feeding);

    -- Fee schedule for JHS1
    INSERT INTO fee_schedules (id, class_level_id, term_id, academic_year_id, status)
    SELECT v_fee_sched_jhs1, v_level_jhs1, v_term1_2627, v_year_2627, 'PUBLISHED'
    WHERE NOT EXISTS (SELECT 1 FROM fee_schedules WHERE class_level_id = v_level_jhs1 AND term_id = v_term1_2627);

    INSERT INTO fee_items (id, fee_schedule_id, description, amount, is_mandatory)
    SELECT v_fee_item_jhs_tuition, v_fee_sched_jhs1, 'Tuition Fee',  1100.00, true  WHERE NOT EXISTS (SELECT 1 FROM fee_items WHERE id = v_fee_item_jhs_tuition);
    INSERT INTO fee_items (id, fee_schedule_id, description, amount, is_mandatory)
    SELECT v_fee_item_jhs_feeding, v_fee_sched_jhs1, 'Feeding Fee',   400.00, false WHERE NOT EXISTS (SELECT 1 FROM fee_items WHERE id = v_fee_item_jhs_feeding);

    -- Resolve fee schedule IDs in case they already existed
    SELECT id INTO v_fee_sched_p3   FROM fee_schedules WHERE class_level_id = v_level_p3   AND term_id = v_term1_2627;
    SELECT id INTO v_fee_sched_jhs1 FROM fee_schedules WHERE class_level_id = v_level_jhs1 AND term_id = v_term1_2627;

    -- Invoice for STD-26-003 (Daniel — partially paid)
    INSERT INTO invoices (id, enrollment_id, fee_schedule_id, total_amount, paid_amount, status, issue_date, due_date)
    SELECT v_inv_3, v_enr_3, v_fee_sched_p3, 1250.00, 900.00, 'PARTIAL', '2026-09-01', '2026-09-30'
    WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE enrollment_id = v_enr_3);

    INSERT INTO invoice_lines (invoice_id, fee_item_id, amount)
    SELECT v_inv_3, fi.id, fi.amount
    FROM fee_items fi WHERE fi.fee_schedule_id = v_fee_sched_p3
    ON CONFLICT DO NOTHING;

    -- Invoice for STD-26-004 (Grace — unpaid)
    INSERT INTO invoices (id, enrollment_id, fee_schedule_id, total_amount, paid_amount, status, issue_date, due_date)
    SELECT v_inv_4, v_enr_4, v_fee_sched_jhs1, 1500.00, 0.00, 'ISSUED', '2026-09-01', '2026-09-30'
    WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE enrollment_id = v_enr_4);

    INSERT INTO invoice_lines (invoice_id, fee_item_id, amount)
    SELECT v_inv_4, fi.id, fi.amount
    FROM fee_items fi WHERE fi.fee_schedule_id = v_fee_sched_jhs1
    ON CONFLICT DO NOTHING;

    -- Payment for Daniel (partial)
    INSERT INTO payments (id, student_id, receipt_number, amount, payment_date, payment_method, reference, is_reversed)
    SELECT v_pay_3, v_student_3, 'RCP-26-0003', 900.00, '2026-09-06', 'BANK_TRANSFER', 'GHB-772291', false
    WHERE NOT EXISTS (SELECT 1 FROM payments WHERE receipt_number = 'RCP-26-0003');

    INSERT INTO payment_allocations (payment_id, invoice_id, allocated_amount)
    SELECT v_pay_3, v_inv_3, 900.00
    WHERE NOT EXISTS (SELECT 1 FROM payment_allocations WHERE payment_id = v_pay_3 AND invoice_id = v_inv_3);

    ---------------------------------------------------------------------------
    -- 8. ENRICHED ANNOUNCEMENTS (different audiences)
    ---------------------------------------------------------------------------
    INSERT INTO announcements (id, title, body, target_audience, status, published_at) VALUES
        (gen_random_uuid(),
         'Term 1 Fee Payment Deadline — Final Reminder',
         'Dear Parents and Guardians, please note that the fee payment deadline for Term 1 is 30th September 2026. Accounts with outstanding balances after this date will attract a late fee.',
         'ALL', 'PUBLISHED', NOW() - INTERVAL '3 DAYS'),

        (gen_random_uuid(),
         'Staff Professional Development Day — 15th September',
         'All teaching and non-teaching staff are required to attend the Professional Development workshop on Monday 15th September. Attendance is mandatory.',
         'STAFF', 'PUBLISHED', NOW() - INTERVAL '6 DAYS'),

        (gen_random_uuid(),
         'JHS Mock Examination Schedule — Term 1',
         'JHS 1, 2 and 3 students will sit their Mock Examinations from 20th–24th October 2026. Timetables have been distributed to class teachers.',
         'ALL', 'PUBLISHED', NOW() - INTERVAL '1 DAY'),

        (gen_random_uuid(),
         'Library Orientation — All P1 and P2 Students',
         'All Primary 1 and Primary 2 students will have their Library Orientation session on Thursday 10th September. Please bring a note-taking book.',
         'ALL', 'PUBLISHED', NOW() - INTERVAL '10 DAYS'),

        (gen_random_uuid(),
         'Health Check-up Campaign — Week of 22nd September',
         'The school will be hosting a free health check-up campaign for all students. Parents are advised to ensure their wards are present during this week.',
         'ALL', 'PUBLISHED', NOW() - INTERVAL '8 DAYS')
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 9. TIMETABLE — module is stub-only in this release
    -- Timetable entries will be seeded in a future migration once the
    -- timetable module domain model and schema are implemented.
    -- (Reference: docs/13-roadmap.md — Phase 2)
    ---------------------------------------------------------------------------
    RAISE NOTICE 'Timetable seeding skipped — module schema not yet defined.';

    ---------------------------------------------------------------------------
    -- 10. NOTIFICATION OUTBOX — additional events for full outbox coverage
    ---------------------------------------------------------------------------
    INSERT INTO notification_outbox (event_type, payload, status, created_at) VALUES
        ('GUARDIAN_ACCOUNT_CREATED', '{"guardian": "Mary Agyeman", "username": "mary.agyeman"}', 'PROCESSED', NOW() - INTERVAL '2 HOURS'),
        ('FEE_OVERDUE_REMINDER',     '{"studentNumber": "STD-26-004", "amount": 1500.00}',        'PENDING',   NOW() - INTERVAL '30 MINUTES'),
        ('ANNOUNCEMENT_PUBLISHED',   '{"title": "JHS Mock Examination Schedule"}',                'PROCESSED', NOW() - INTERVAL '1 DAY')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'V24 exhaustive seed complete — all actors provisioned.';
END $$;
