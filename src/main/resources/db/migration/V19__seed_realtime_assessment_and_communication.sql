-- =============================================================================
-- V19 — Real-time Assessment & Communication Seed Expansion
-- Ensures rich test data for real-time Report Cards, Assessment Grids, Outbox Logs, and Announcements.
-- =============================================================================

DO $$
DECLARE
    v_year_2627 UUID;
    v_term1_2627 UUID;
    v_student_1 UUID;
    v_student_2 UUID;
    v_student_3 UUID;
    v_student_4 UUID;
    v_enr_1 UUID;
    v_enr_2 UUID;
    v_enr_3 UUID;
    v_enr_4 UUID;
    v_outbox_1 UUID := gen_random_uuid();
    v_outbox_2 UUID := gen_random_uuid();
    v_outbox_3 UUID := gen_random_uuid();
BEGIN
    SELECT id INTO v_year_2627 FROM academic_years WHERE name = '2026/2027';
    SELECT id INTO v_term1_2627 FROM terms WHERE academic_year_id = v_year_2627 AND term_number = 1;
    
    SELECT id INTO v_student_1 FROM students WHERE student_number = 'STD-26-001';
    SELECT id INTO v_student_2 FROM students WHERE student_number = 'STD-26-002';
    SELECT id INTO v_student_3 FROM students WHERE student_number = 'STD-26-003';
    SELECT id INTO v_student_4 FROM students WHERE student_number = 'STD-26-004';
    
    SELECT id INTO v_enr_1 FROM enrollments WHERE student_id = v_student_1;
    SELECT id INTO v_enr_2 FROM enrollments WHERE student_id = v_student_2;
    SELECT id INTO v_enr_3 FROM enrollments WHERE student_id = v_student_3;
    SELECT id INTO v_enr_4 FROM enrollments WHERE student_id = v_student_4;

    -- Seed Report Cards
    IF v_enr_1 IS NOT NULL AND v_term1_2627 IS NOT NULL THEN
        INSERT INTO report_cards (id, enrollment_id, term_id, remarks, published_at)
        VALUES 
            (gen_random_uuid(), v_enr_1, v_term1_2627, 'Outstanding academic performance. Yaw demonstrates exceptional diligence.', NOW())
        ON CONFLICT (enrollment_id, term_id) DO NOTHING;
    END IF;

    IF v_enr_2 IS NOT NULL AND v_term1_2627 IS NOT NULL THEN
        INSERT INTO report_cards (id, enrollment_id, term_id, remarks, published_at)
        VALUES 
            (gen_random_uuid(), v_enr_2, v_term1_2627, 'Good effort shown this term. Continued practice in Mathematics is encouraged.', NOW())
        ON CONFLICT (enrollment_id, term_id) DO NOTHING;
    END IF;

    -- Seed Notification Outbox logs
    INSERT INTO notification_outbox (id, event_type, payload, status, created_at) VALUES 
        (v_outbox_1, 'STUDENT_ENROLLED', '{"studentNumber": "STD-26-001", "className": "Primary 1A"}', 'PROCESSED', NOW() - INTERVAL '1 DAY'),
        (v_outbox_2, 'FEE_PAYMENT_RECEIVED', '{"receiptNumber": "RCP-26-0001", "amount": 1200.00}', 'PROCESSED', NOW() - INTERVAL '4 HOURS'),
        (v_outbox_3, 'REPORT_CARD_PUBLISHED', '{"term": "Term 1", "academicYear": "2026/2027"}', 'PROCESSED', NOW() - INTERVAL '1 HOUR')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Notification Deliveries
    INSERT INTO notification_deliveries (id, outbox_id, recipient, message, status, provider_reference, cost) VALUES 
        (gen_random_uuid(), v_outbox_1, '+233541234567', 'Welcome to UBS-LMIS! Yaw Frimpong has been enrolled in Primary 1A.', 'SENT', 'HUBTEL-99812', 0.0300),
        (gen_random_uuid(), v_outbox_2, '+233541234567', 'Payment of GHS 1200.00 received. Receipt RCP-26-0001.', 'SENT', 'HUBTEL-99813', 0.0300),
        (gen_random_uuid(), v_outbox_3, 'samuel.frimpong@example.com', 'Term 1 Report Card for Yaw Frimpong is now available on the portal.', 'SENT', 'SMTP-88210', 0.0000)
    ON CONFLICT (id) DO NOTHING;

    -- Seed Additional Announcements
    INSERT INTO announcements (id, title, body, target_audience, status, published_at) VALUES 
        (gen_random_uuid(), 'PTA General Meeting Notice', 'Dear Parents and Guardians, the Term 1 PTA General meeting is scheduled for Friday at 2:00 PM in the Assembly Hall.', 'ALL', 'PUBLISHED', NOW() - INTERVAL '2 DAYS'),
        (gen_random_uuid(), 'Mid-Term Assessment & Exam Timetable', 'The Mid-Term exam timetable for Primary and JHS departments has been published.', 'ALL', 'PUBLISHED', NOW() - INTERVAL '5 DAYS')
    ON CONFLICT (id) DO NOTHING;

END $$;
