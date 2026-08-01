-- =============================================================================
-- V15 — Exhaustive Seed Test Data (Ghanaian Localization)
-- Populates the system with realistic test data across all domains.
-- Default Password for all seeded accounts is 'Password123'
-- =============================================================================

DO $$
DECLARE
    -- Auth Roles
    v_head_role UUID;
    v_teacher_role UUID;
    v_accountant_role UUID;
    v_guardian_role UUID;
    v_student_role UUID;
    
    -- Academic Reference Data
    v_dept_prim UUID;
    v_dept_jhs UUID;
    v_level_p1 UUID;
    v_level_p3 UUID;
    v_level_jhs1 UUID;
    v_subj_eng UUID;
    v_subj_math UUID;
    v_subj_sci UUID;
    
    -- Academic Structure
    v_year_2526 UUID := gen_random_uuid();
    v_year_2627 UUID := gen_random_uuid();
    v_term1_2627 UUID := gen_random_uuid();
    v_term2_2627 UUID := gen_random_uuid();
    v_term3_2627 UUID := gen_random_uuid();
    
    v_class_p1a UUID := gen_random_uuid();
    v_class_p3a UUID := gen_random_uuid();
    v_class_jhs1a UUID := gen_random_uuid();
    
    v_cso_p1a_eng UUID := gen_random_uuid();
    v_cso_p1a_math UUID := gen_random_uuid();
    v_cso_p1a_sci UUID := gen_random_uuid();
    
    -- People
    v_staff_head UUID := gen_random_uuid();
    v_staff_t1 UUID := gen_random_uuid();
    v_staff_t2 UUID := gen_random_uuid();
    v_staff_acct UUID := gen_random_uuid();
    
    v_guardian_1 UUID := gen_random_uuid();
    v_guardian_2 UUID := gen_random_uuid();
    
    v_student_1 UUID := gen_random_uuid();
    v_student_2 UUID := gen_random_uuid();
    v_student_3 UUID := gen_random_uuid();
    v_student_4 UUID := gen_random_uuid();
    
    -- Enrollment
    v_enr_1 UUID := gen_random_uuid();
    v_enr_2 UUID := gen_random_uuid();
    v_enr_3 UUID := gen_random_uuid();
    v_enr_4 UUID := gen_random_uuid();
    
    -- Assessment
    v_grade_scale UUID := gen_random_uuid();
    v_ac_eng_sba UUID := gen_random_uuid();
    v_ac_eng_exam UUID := gen_random_uuid();
    v_ac_math_sba UUID := gen_random_uuid();
    v_ac_math_exam UUID := gen_random_uuid();
    
    -- Finance
    v_fee_sched_p1 UUID := gen_random_uuid();
    v_fee_item_tuition UUID := gen_random_uuid();
    v_fee_item_feeding UUID := gen_random_uuid();
    v_inv_1 UUID := gen_random_uuid();
    v_inv_2 UUID := gen_random_uuid();
    v_pay_1 UUID := gen_random_uuid();
    
    -- Auth
    v_acct_head UUID := gen_random_uuid();
    v_acct_t1 UUID := gen_random_uuid();
    v_acct_acct UUID := gen_random_uuid();
    v_acct_g1 UUID := gen_random_uuid();
    v_acct_s1 UUID := gen_random_uuid();
    v_acct_s2 UUID := gen_random_uuid();
    
    -- Using BCrypt hash for 'Password123'
    v_default_password_hash TEXT := '$2b$12$SeZvAenYvq/q6fOZw1SyMOFbkqDZZHLYHqHUFB9I/lmFRsNxxYb6y';
BEGIN
    ---------------------------------------------------------------------------
    -- 1. Get Reference Data UUIDs
    ---------------------------------------------------------------------------
    SELECT id INTO v_head_role FROM roles WHERE name = 'HEAD_OF_SCHOOL';
    SELECT id INTO v_teacher_role FROM roles WHERE name = 'TEACHER';
    SELECT id INTO v_accountant_role FROM roles WHERE name = 'ACCOUNTANT';
    SELECT id INTO v_guardian_role FROM roles WHERE name = 'GUARDIAN';
    SELECT id INTO v_student_role FROM roles WHERE name = 'STUDENT';
    
    SELECT id INTO v_dept_prim FROM departments WHERE code = 'PRIMARY';
    SELECT id INTO v_dept_jhs FROM departments WHERE code = 'JHS';
    
    SELECT id INTO v_level_p1 FROM class_levels WHERE code = 'P1';
    SELECT id INTO v_level_p3 FROM class_levels WHERE code = 'P3';
    SELECT id INTO v_level_jhs1 FROM class_levels WHERE code = 'JHS1';
    
    SELECT id INTO v_subj_eng FROM subjects WHERE code = 'ENG';
    SELECT id INTO v_subj_math FROM subjects WHERE code = 'MATH';
    SELECT id INTO v_subj_sci FROM subjects WHERE code = 'SCI';
    
    ---------------------------------------------------------------------------
    -- 2. Academic Structure
    ---------------------------------------------------------------------------
    INSERT INTO academic_years (id, name, start_date, end_date, status) VALUES 
        (v_year_2526, '2025/2026', '2025-09-01', '2026-07-25', 'CLOSED'),
        (v_year_2627, '2026/2027', '2026-09-01', '2027-07-25', 'ACTIVE');
        
    INSERT INTO terms (id, academic_year_id, term_number, start_date, end_date) VALUES 
        (v_term1_2627, v_year_2627, 1, '2026-09-01', '2026-12-15'),
        (v_term2_2627, v_year_2627, 2, '2027-01-10', '2027-04-10'),
        (v_term3_2627, v_year_2627, 3, '2027-05-01', '2027-07-25');
        
    INSERT INTO classes (id, academic_year_id, class_level_id, stream, capacity) VALUES 
        (v_class_p1a, v_year_2627, v_level_p1, 'A', 35),
        (v_class_p3a, v_year_2627, v_level_p3, 'A', 35),
        (v_class_jhs1a, v_year_2627, v_level_jhs1, 'A', 40);
        
    INSERT INTO class_subject_offerings (id, class_id, subject_id) VALUES 
        (v_cso_p1a_eng, v_class_p1a, v_subj_eng),
        (v_cso_p1a_math, v_class_p1a, v_subj_math),
        (v_cso_p1a_sci, v_class_p1a, v_subj_sci);
        
    ---------------------------------------------------------------------------
    -- 3. People (Staff, Guardians, Students)
    ---------------------------------------------------------------------------
    -- Staff
    INSERT INTO staff (id, staff_number, first_name, last_name, staff_type, employment_start, status) VALUES 
        (v_staff_head, 'STF-001', 'Kwame', 'Osei', 'NON_TEACHING', '2015-09-01', 'ACTIVE'),
        (v_staff_t1, 'STF-002', 'Ama', 'Mensah', 'TEACHING', '2018-09-01', 'ACTIVE'),
        (v_staff_t2, 'STF-003', 'Kofi', 'Owusu', 'TEACHING', '2020-01-15', 'ACTIVE'),
        (v_staff_acct, 'STF-004', 'Kojo', 'Appiah', 'NON_TEACHING', '2019-05-01', 'ACTIVE');
        
    -- Guardians
    INSERT INTO guardians (id, first_name, last_name, phone, email, occupation) VALUES 
        (v_guardian_1, 'Samuel', 'Frimpong', '+233541234567', 'samuel.frimpong@example.com', 'Engineer'),
        (v_guardian_2, 'Mary', 'Agyeman', '+233201234567', 'mary.agyeman@example.com', 'Trader');
        
    -- Students
    INSERT INTO students (id, student_number, first_name, last_name, date_of_birth, gender, admission_date, status) VALUES 
        (v_student_1, 'STD-26-001', 'Yaw', 'Frimpong', '2019-04-15', 'MALE', '2026-09-01', 'ACTIVE'),
        (v_student_2, 'STD-26-002', 'Akosua', 'Frimpong', '2020-08-20', 'FEMALE', '2026-09-01', 'ACTIVE'),
        (v_student_3, 'STD-26-003', 'Daniel', 'Agyeman', '2017-02-10', 'MALE', '2024-09-01', 'ACTIVE'),
        (v_student_4, 'STD-26-004', 'Grace', 'Addo', '2014-11-05', 'FEMALE', '2021-09-01', 'ACTIVE');
        
    -- Student Guardians
    INSERT INTO student_guardians (student_id, guardian_id, relationship_type, is_primary_contact, receives_billing, receives_academic_reports) VALUES 
        (v_student_1, v_guardian_1, 'FATHER', true, true, true),
        (v_student_2, v_guardian_1, 'FATHER', true, true, true),
        (v_student_3, v_guardian_2, 'MOTHER', true, true, true);
        
    ---------------------------------------------------------------------------
    -- 4. Authentication (Accounts & Roles)
    ---------------------------------------------------------------------------
    -- Head of School
    INSERT INTO accounts (id, username, password_hash, person_type, person_id) VALUES 
        (v_acct_head, 'kwame.osei', v_default_password_hash, 'STAFF', v_staff_head);
    INSERT INTO account_roles (account_id, role_id) VALUES (v_acct_head, v_head_role);
    
    -- Teacher 1
    INSERT INTO accounts (id, username, password_hash, person_type, person_id) VALUES 
        (v_acct_t1, 'ama.mensah', v_default_password_hash, 'STAFF', v_staff_t1);
    INSERT INTO account_roles (account_id, role_id) VALUES (v_acct_t1, v_teacher_role);
    
    -- Accountant
    INSERT INTO accounts (id, username, password_hash, person_type, person_id) VALUES 
        (v_acct_acct, 'kojo.appiah', v_default_password_hash, 'STAFF', v_staff_acct);
    INSERT INTO account_roles (account_id, role_id) VALUES (v_acct_acct, v_accountant_role);
    
    -- Guardian 1
    INSERT INTO accounts (id, username, password_hash, person_type, person_id) VALUES 
        (v_acct_g1, 'samuel.frimpong', v_default_password_hash, 'GUARDIAN', v_guardian_1);
    INSERT INTO account_roles (account_id, role_id) VALUES (v_acct_g1, v_guardian_role);
    
    -- Student 1 & 2
    INSERT INTO accounts (id, username, password_hash, person_type, person_id) VALUES 
        (v_acct_s1, 'STD-26-001', v_default_password_hash, 'STUDENT', v_student_1),
        (v_acct_s2, 'STD-26-002', v_default_password_hash, 'STUDENT', v_student_2);
    INSERT INTO account_roles (account_id, role_id) VALUES 
        (v_acct_s1, v_student_role),
        (v_acct_s2, v_student_role);

    ---------------------------------------------------------------------------
    -- 5. Enrollment & Attendance
    ---------------------------------------------------------------------------
    INSERT INTO enrollments (id, student_id, class_id, academic_year_id, status) VALUES 
        (v_enr_1, v_student_1, v_class_p1a, v_year_2627, 'ACTIVE'),
        (v_enr_2, v_student_2, v_class_p1a, v_year_2627, 'ACTIVE'),
        (v_enr_3, v_student_3, v_class_p3a, v_year_2627, 'ACTIVE'),
        (v_enr_4, v_student_4, v_class_jhs1a, v_year_2627, 'ACTIVE');
        
    INSERT INTO attendance_records (enrollment_id, attendance_date, status, marked_by) VALUES 
        (v_enr_1, '2026-09-02', 'PRESENT', v_staff_t1),
        (v_enr_2, '2026-09-02', 'PRESENT', v_staff_t1),
        (v_enr_1, '2026-09-03', 'LATE', v_staff_t1),
        (v_enr_2, '2026-09-03', 'ABSENT', v_staff_t1);

    ---------------------------------------------------------------------------
    -- 6. Assessment
    ---------------------------------------------------------------------------
    -- Since V10 fails when no year exists, we recreate the default grade scale here
    INSERT INTO grade_scales (id, academic_year_id, name) VALUES 
        (v_grade_scale, v_year_2627, 'Standard GES Scale 26/27');
        
    INSERT INTO grade_bands (grade_scale_id, name, min_score, max_score, point_value, remarks) VALUES
        (v_grade_scale, 'A', 80.00, 100.00, 1.0, 'Excellent'),
        (v_grade_scale, 'B', 70.00, 79.99, 2.0, 'Very Good'),
        (v_grade_scale, 'C', 60.00, 69.99, 3.0, 'Good'),
        (v_grade_scale, 'D', 50.00, 59.99, 4.0, 'Credit'),
        (v_grade_scale, 'E', 40.00, 49.99, 5.0, 'Pass'),
        (v_grade_scale, 'F', 0.00, 39.99, 9.0, 'Fail');

    INSERT INTO assessment_components (id, class_subject_offering_id, term_id, name, max_score, weight) VALUES 
        (v_ac_eng_sba, v_cso_p1a_eng, v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_eng_exam, v_cso_p1a_eng, v_term1_2627, 'End of Term Exam', 100, 70),
        (v_ac_math_sba, v_cso_p1a_math, v_term1_2627, 'Class Assessment (SBA)', 100, 30),
        (v_ac_math_exam, v_cso_p1a_math, v_term1_2627, 'End of Term Exam', 100, 70);
        
    INSERT INTO scores (assessment_component_id, enrollment_id, raw_score) VALUES 
        (v_ac_eng_sba, v_enr_1, 85.00),
        (v_ac_eng_exam, v_enr_1, 75.00),
        (v_ac_math_sba, v_enr_1, 90.00),
        (v_ac_math_exam, v_enr_1, 88.00),
        
        (v_ac_eng_sba, v_enr_2, 60.00),
        (v_ac_eng_exam, v_enr_2, 55.00);
        
    INSERT INTO term_results (enrollment_id, term_id, subject_id, sba_total, exam_total, overall_total, grade, status) VALUES 
        (v_enr_1, v_term1_2627, v_subj_eng, 25.5, 52.5, 78.0, 'B', 'PUBLISHED'),
        (v_enr_1, v_term1_2627, v_subj_math, 27.0, 61.6, 88.6, 'A', 'PUBLISHED');
        
    ---------------------------------------------------------------------------
    -- 7. Finance
    ---------------------------------------------------------------------------
    INSERT INTO fee_schedules (id, class_level_id, term_id, academic_year_id, status) VALUES 
        (v_fee_sched_p1, v_level_p1, v_term1_2627, v_year_2627, 'PUBLISHED');
        
    INSERT INTO fee_items (id, fee_schedule_id, description, amount, is_mandatory) VALUES 
        (v_fee_item_tuition, v_fee_sched_p1, 'Tuition Fee', 850.00, true),
        (v_fee_item_feeding, v_fee_sched_p1, 'Feeding Fee', 350.00, false);
        
    INSERT INTO invoices (id, enrollment_id, fee_schedule_id, total_amount, paid_amount, status, issue_date, due_date) VALUES 
        (v_inv_1, v_enr_1, v_fee_sched_p1, 1200.00, 1200.00, 'PAID', '2026-09-01', '2026-09-30'),
        (v_inv_2, v_enr_2, v_fee_sched_p1, 1200.00, 500.00, 'PARTIAL', '2026-09-01', '2026-09-30');
        
    INSERT INTO invoice_lines (invoice_id, fee_item_id, amount) VALUES 
        (v_inv_1, v_fee_item_tuition, 850.00),
        (v_inv_1, v_fee_item_feeding, 350.00),
        (v_inv_2, v_fee_item_tuition, 850.00),
        (v_inv_2, v_fee_item_feeding, 350.00);
        
    INSERT INTO payments (id, student_id, receipt_number, amount, payment_date, payment_method, reference, is_reversed) VALUES 
        (v_pay_1, v_student_1, 'RCP-26-0001', 1200.00, '2026-09-05', 'MOBILE_MONEY', 'MTN-123456', false),
        (gen_random_uuid(), v_student_2, 'RCP-26-0002', 500.00, '2026-09-10', 'CASH', NULL, false);
        
    INSERT INTO payment_allocations (payment_id, invoice_id, allocated_amount) VALUES 
        (v_pay_1, v_inv_1, 1200.00);

    ---------------------------------------------------------------------------
    -- 8. Communication & Progression
    ---------------------------------------------------------------------------
    INSERT INTO message_templates (name, subject, body) VALUES 
        ('FEE_REMINDER', 'Outstanding Fees Reminder', 'Dear Guardian, kindly settle outstanding fees of GHS {{amount}} for {{student_name}}.');
        
    INSERT INTO announcements (title, body, target_audience, status, published_at) VALUES 
        ('Welcome to 2026/2027', 'Welcome to the new academic year!', 'ALL', 'PUBLISHED', '2026-09-01');
        
    INSERT INTO notification_outbox (event_type, payload, status) VALUES 
        ('INVOICE_GENERATED', '{"invoice_id": "' || v_inv_1 || '"}', 'PENDING');
        
END $$;
