-- V18 — Update seed data with email, phone, and class teachers

-- Update Staff Contact Information
UPDATE staff SET email = 'kwame.osei@ubs.edu.gh', phone = '+233541112222' WHERE staff_number = 'STF-001';
UPDATE staff SET email = 'ama.mensah@ubs.edu.gh', phone = '+233242223333' WHERE staff_number = 'STF-002';
UPDATE staff SET email = 'kofi.owusu@ubs.edu.gh', phone = '+233203334444' WHERE staff_number = 'STF-003';
UPDATE staff SET email = 'kojo.appiah@ubs.edu.gh', phone = '+233504445555' WHERE staff_number = 'STF-004';

-- Update Classes with Class Teachers
UPDATE classes SET class_teacher_id = (SELECT id FROM staff WHERE staff_number = 'STF-002')
WHERE class_level_id = (SELECT id FROM class_levels WHERE code = 'P1') AND stream = 'A';

UPDATE classes SET class_teacher_id = (SELECT id FROM staff WHERE staff_number = 'STF-003')
WHERE class_level_id = (SELECT id FROM class_levels WHERE code = 'P3') AND stream = 'A';
