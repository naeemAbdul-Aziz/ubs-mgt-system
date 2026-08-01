-- =============================================================================
-- V3 — Seed Permissions and Roles
-- Permission catalog (doc 14 §6) + role-permission assignments (doc 03 §3).
-- This migration is the source of truth for baseline RBAC.
-- =============================================================================

-- =============================================================================
-- Insert all roles
-- =============================================================================
INSERT INTO roles (id, name, description) VALUES
    (gen_random_uuid(), 'SYSTEM_ADMIN',    'Full technical administration. Not automatically entitled to academic/finance approvals.'),
    (gen_random_uuid(), 'HEAD_OF_SCHOOL',  'Final approvals on results, promotions, admissions, adjustments. School-wide read access.'),
    (gen_random_uuid(), 'SCHOOL_ADMIN',    'Front-office administration: student records, admissions processing, class setup, announcements.'),
    (gen_random_uuid(), 'HOD',             'Department scope: approves results, oversees teachers and classes in the department.'),
    (gen_random_uuid(), 'TEACHER',         'Marks attendance and enters scores for own classes/subjects.'),
    (gen_random_uuid(), 'ACCOUNTANT',      'Fee schedules, invoicing, payments, financial reports.'),
    (gen_random_uuid(), 'LIBRARIAN',       'Library catalog and loans.'),
    (gen_random_uuid(), 'NURSE',           'Health profiles and medical visits.'),
    (gen_random_uuid(), 'GUARDIAN',        'Read access to own wards: results, attendance, invoices, announcements. Pays fees. Updates own contact info.'),
    (gen_random_uuid(), 'STUDENT',         'Read own results and timetable. Submit LMS work (post-MVP). JHS only.');

-- =============================================================================
-- Insert all permissions (doc 14 §6)
-- =============================================================================

-- Accounts & Roles
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ACCOUNT_VIEW',        'View user accounts'),
    (gen_random_uuid(), 'ACCOUNT_CREATE',      'Create user accounts'),
    (gen_random_uuid(), 'ACCOUNT_UPDATE',      'Update user account details'),
    (gen_random_uuid(), 'ACCOUNT_DEACTIVATE',  'Deactivate a user account'),
    (gen_random_uuid(), 'ROLE_ASSIGN',         'Assign or remove roles from accounts');

-- Academic Structure
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ACADEMIC_YEAR_VIEW',       'View academic years'),
    (gen_random_uuid(), 'ACADEMIC_YEAR_CREATE',     'Create academic years'),
    (gen_random_uuid(), 'ACADEMIC_YEAR_UPDATE',     'Update academic year details'),
    (gen_random_uuid(), 'ACADEMIC_YEAR_CLOSE',      'Close an academic year'),
    (gen_random_uuid(), 'CLASS_VIEW',               'View classes'),
    (gen_random_uuid(), 'CLASS_CREATE',             'Create classes'),
    (gen_random_uuid(), 'CLASS_UPDATE',             'Update class details'),
    (gen_random_uuid(), 'SUBJECT_VIEW',             'View subjects'),
    (gen_random_uuid(), 'SUBJECT_OFFERING_MANAGE',  'Manage class-subject offerings'),
    (gen_random_uuid(), 'TEACHER_ASSIGNMENT_MANAGE','Assign teachers to subjects/classes'),
    (gen_random_uuid(), 'CALENDAR_MANAGE',          'Manage school-day calendar and exceptions');

-- Students & Guardians
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'STUDENT_VIEW',             'View student records'),
    (gen_random_uuid(), 'STUDENT_VIEW_IDENTITY_ONLY','View student identity fields only (name, number)'),
    (gen_random_uuid(), 'STUDENT_CREATE',           'Create new student records'),
    (gen_random_uuid(), 'STUDENT_UPDATE',           'Update student bio and status'),
    (gen_random_uuid(), 'STUDENT_ARCHIVE',          'Archive (soft-delete) a student record'),
    (gen_random_uuid(), 'GUARDIAN_VIEW',            'View guardian records'),
    (gen_random_uuid(), 'GUARDIAN_CREATE',          'Create guardian records'),
    (gen_random_uuid(), 'GUARDIAN_UPDATE',          'Update guardian contact details'),
    (gen_random_uuid(), 'GUARDIAN_LINK_MANAGE',     'Create/update student-guardian links'),
    (gen_random_uuid(), 'STUDENT_DOCUMENT_VIEW',    'View student documents'),
    (gen_random_uuid(), 'STUDENT_DOCUMENT_UPLOAD',  'Upload student documents');

-- Enrollment
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ENROLLMENT_VIEW',   'View enrollments'),
    (gen_random_uuid(), 'ENROLLMENT_CREATE', 'Create new enrollments'),
    (gen_random_uuid(), 'ENROLLMENT_END',    'End an enrollment (transfer/withdrawal)'),
    (gen_random_uuid(), 'ROSTER_VIEW',       'View class rosters');

-- Attendance
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ATTENDANCE_VIEW',    'View attendance records'),
    (gen_random_uuid(), 'ATTENDANCE_MARK',    'Submit attendance registers'),
    (gen_random_uuid(), 'ATTENDANCE_CORRECT', 'Correct past attendance records');

-- Assessment
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ASSESSMENT_COMPONENT_MANAGE', 'Create/update assessment components'),
    (gen_random_uuid(), 'SCORE_ENTER',          'Enter student scores'),
    (gen_random_uuid(), 'RESULT_VIEW',          'View term results'),
    (gen_random_uuid(), 'RESULT_SUBMIT',        'Submit results for approval'),
    (gen_random_uuid(), 'RESULT_APPROVE',       'Approve submitted results (HoD step)'),
    (gen_random_uuid(), 'RESULT_PUBLISH',       'Publish approved results (Head step)'),
    (gen_random_uuid(), 'RESULT_REVISE',        'Create a revision of published results'),
    (gen_random_uuid(), 'REPORT_CARD_VIEW',     'View report cards'),
    (gen_random_uuid(), 'GRADE_SCALE_MANAGE',   'Manage grade scales and bands');

-- Progression
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'PROMOTION_PROPOSE',      'Propose promotion decisions'),
    (gen_random_uuid(), 'PROMOTION_APPROVE',      'Approve promotion decisions'),
    (gen_random_uuid(), 'PROMOTION_RUN_EXECUTE',  'Execute a promotion run (bulk enrollment generation)');

-- Finance
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'FEE_SCHEDULE_VIEW',    'View fee schedules'),
    (gen_random_uuid(), 'FEE_SCHEDULE_MANAGE',  'Create and update fee schedules'),
    (gen_random_uuid(), 'FEE_SCHEDULE_APPROVE', 'Approve fee schedules'),
    (gen_random_uuid(), 'INVOICE_VIEW',         'View invoices'),
    (gen_random_uuid(), 'BILLING_RUN_EXECUTE',  'Execute term billing runs'),
    (gen_random_uuid(), 'PAYMENT_VIEW',         'View payment records'),
    (gen_random_uuid(), 'PAYMENT_RECORD',       'Record new payments'),
    (gen_random_uuid(), 'PAYMENT_REVERSE',      'Reverse a payment (compensating entry)'),
    (gen_random_uuid(), 'ADJUSTMENT_PROPOSE',   'Propose invoice adjustments (discounts, waivers)'),
    (gen_random_uuid(), 'ADJUSTMENT_APPROVE',   'Approve proposed adjustments'),
    (gen_random_uuid(), 'FINANCE_REPORT_VIEW',  'View financial reports');

-- Staff
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'STAFF_VIEW',           'View staff records'),
    (gen_random_uuid(), 'STAFF_CREATE',         'Create staff records'),
    (gen_random_uuid(), 'STAFF_UPDATE',         'Update staff details'),
    (gen_random_uuid(), 'STAFF_END_EMPLOYMENT', 'Record employment end for a staff member');

-- Communication
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'ANNOUNCEMENT_CREATE',     'Create and publish announcements'),
    (gen_random_uuid(), 'ANNOUNCEMENT_VIEW',       'View announcements'),
    (gen_random_uuid(), 'NOTIFICATION_VIEW_OWN',   'View own notification inbox'),
    (gen_random_uuid(), 'MESSAGE_TEMPLATE_MANAGE', 'Create and update notification message templates');

-- Analytics & Audit
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'DASHBOARD_VIEW_SCHOOL',      'View school-wide analytics dashboard'),
    (gen_random_uuid(), 'DASHBOARD_VIEW_DEPARTMENT',  'View department analytics dashboard'),
    (gen_random_uuid(), 'DASHBOARD_VIEW_OWN',         'View own (teacher) analytics dashboard'),
    (gen_random_uuid(), 'DASHBOARD_VIEW_FINANCE',     'View finance analytics dashboard'),
    (gen_random_uuid(), 'AUDIT_VIEW',                 'Query the audit log');

-- Export
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'EXPORT_EXECUTE', 'Execute data exports (audited separately per doc 11 §1)');

-- =============================================================================
-- Role-permission assignments (doc 03 §3 permission matrix)
-- =============================================================================

-- SYSTEM_ADMIN — Technical administration
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SYSTEM_ADMIN'
  AND p.code IN (
    'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE', 'ACCOUNT_DEACTIVATE', 'ROLE_ASSIGN',
    'ACADEMIC_YEAR_VIEW', 'CLASS_VIEW', 'SUBJECT_VIEW',
    'STUDENT_VIEW', 'GUARDIAN_VIEW', 'STAFF_VIEW',
    'ENROLLMENT_VIEW', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW', 'RESULT_VIEW', 'REPORT_CARD_VIEW',
    'INVOICE_VIEW', 'PAYMENT_VIEW', 'FEE_SCHEDULE_VIEW',
    'ANNOUNCEMENT_VIEW', 'NOTIFICATION_VIEW_OWN',
    'DASHBOARD_VIEW_SCHOOL', 'AUDIT_VIEW',
    'EXPORT_EXECUTE'
);

-- HEAD_OF_SCHOOL — Final approvals + school-wide read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'HEAD_OF_SCHOOL'
  AND p.code IN (
    'ACCOUNT_VIEW',
    'ACADEMIC_YEAR_VIEW', 'ACADEMIC_YEAR_CREATE', 'ACADEMIC_YEAR_UPDATE', 'ACADEMIC_YEAR_CLOSE',
    'CLASS_VIEW', 'CLASS_CREATE', 'CLASS_UPDATE',
    'SUBJECT_VIEW', 'SUBJECT_OFFERING_MANAGE', 'TEACHER_ASSIGNMENT_MANAGE', 'CALENDAR_MANAGE',
    'STUDENT_VIEW', 'STUDENT_CREATE', 'STUDENT_UPDATE', 'STUDENT_ARCHIVE',
    'GUARDIAN_VIEW', 'GUARDIAN_CREATE', 'GUARDIAN_UPDATE', 'GUARDIAN_LINK_MANAGE',
    'STUDENT_DOCUMENT_VIEW', 'STUDENT_DOCUMENT_UPLOAD',
    'ENROLLMENT_VIEW', 'ENROLLMENT_CREATE', 'ENROLLMENT_END', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW', 'ATTENDANCE_CORRECT',
    'ASSESSMENT_COMPONENT_MANAGE', 'RESULT_VIEW', 'RESULT_APPROVE', 'RESULT_PUBLISH', 'RESULT_REVISE', 'REPORT_CARD_VIEW', 'GRADE_SCALE_MANAGE',
    'PROMOTION_APPROVE', 'PROMOTION_RUN_EXECUTE',
    'FEE_SCHEDULE_VIEW', 'FEE_SCHEDULE_APPROVE', 'INVOICE_VIEW', 'PAYMENT_VIEW', 'ADJUSTMENT_APPROVE', 'FINANCE_REPORT_VIEW',
    'STAFF_VIEW', 'STAFF_CREATE', 'STAFF_UPDATE', 'STAFF_END_EMPLOYMENT',
    'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_VIEW',
    'DASHBOARD_VIEW_SCHOOL', 'DASHBOARD_VIEW_FINANCE', 'AUDIT_VIEW',
    'EXPORT_EXECUTE'
);

-- SCHOOL_ADMIN — Front-office operations
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SCHOOL_ADMIN'
  AND p.code IN (
    'ACADEMIC_YEAR_VIEW', 'CLASS_VIEW', 'CLASS_CREATE', 'CLASS_UPDATE',
    'SUBJECT_VIEW', 'SUBJECT_OFFERING_MANAGE', 'TEACHER_ASSIGNMENT_MANAGE',
    'STUDENT_VIEW', 'STUDENT_CREATE', 'STUDENT_UPDATE',
    'GUARDIAN_VIEW', 'GUARDIAN_CREATE', 'GUARDIAN_UPDATE', 'GUARDIAN_LINK_MANAGE',
    'STUDENT_DOCUMENT_VIEW', 'STUDENT_DOCUMENT_UPLOAD',
    'ENROLLMENT_VIEW', 'ENROLLMENT_CREATE', 'ENROLLMENT_END', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW', 'ATTENDANCE_CORRECT',
    'RESULT_VIEW', 'REPORT_CARD_VIEW',
    'STAFF_VIEW', 'STAFF_CREATE', 'STAFF_UPDATE',
    'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_VIEW',
    'DASHBOARD_VIEW_SCHOOL'
);

-- HOD — Department-scoped oversight
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'HOD'
  AND p.code IN (
    'ACADEMIC_YEAR_VIEW', 'CLASS_VIEW', 'SUBJECT_VIEW', 'TEACHER_ASSIGNMENT_MANAGE',
    'STUDENT_VIEW', 'GUARDIAN_VIEW',
    'ENROLLMENT_VIEW', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW', 'ATTENDANCE_CORRECT',
    'ASSESSMENT_COMPONENT_MANAGE', 'RESULT_VIEW', 'RESULT_APPROVE', 'REPORT_CARD_VIEW',
    'PROMOTION_PROPOSE',
    'STAFF_VIEW',
    'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_VIEW',
    'DASHBOARD_VIEW_DEPARTMENT'
);

-- TEACHER — Own classes/subjects
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'TEACHER'
  AND p.code IN (
    'ACADEMIC_YEAR_VIEW', 'CLASS_VIEW', 'SUBJECT_VIEW',
    'STUDENT_VIEW', 'GUARDIAN_VIEW',
    'ENROLLMENT_VIEW', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW', 'ATTENDANCE_MARK',
    'ASSESSMENT_COMPONENT_MANAGE', 'SCORE_ENTER', 'RESULT_VIEW', 'RESULT_SUBMIT', 'REPORT_CARD_VIEW',
    'STAFF_VIEW',
    'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_VIEW',
    'DASHBOARD_VIEW_OWN'
);

-- ACCOUNTANT — Finance module
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ACCOUNTANT'
  AND p.code IN (
    'STUDENT_VIEW', 'GUARDIAN_VIEW', 'STAFF_VIEW',
    'ENROLLMENT_VIEW', 'ROSTER_VIEW',
    'FEE_SCHEDULE_VIEW', 'FEE_SCHEDULE_MANAGE',
    'INVOICE_VIEW', 'BILLING_RUN_EXECUTE',
    'PAYMENT_VIEW', 'PAYMENT_RECORD', 'PAYMENT_REVERSE',
    'ADJUSTMENT_PROPOSE',
    'FINANCE_REPORT_VIEW',
    'DASHBOARD_VIEW_FINANCE',
    'EXPORT_EXECUTE'
);

-- GUARDIAN — Own wards (scope enforced in service layer)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'GUARDIAN'
  AND p.code IN (
    'STUDENT_VIEW',
    'GUARDIAN_UPDATE',
    'ENROLLMENT_VIEW', 'ROSTER_VIEW',
    'ATTENDANCE_VIEW',
    'RESULT_VIEW', 'REPORT_CARD_VIEW',
    'INVOICE_VIEW',
    'ANNOUNCEMENT_VIEW', 'NOTIFICATION_VIEW_OWN'
);

-- STUDENT — Own data (JHS only; scope enforced in service layer)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'STUDENT'
  AND p.code IN (
    'STUDENT_VIEW',
    'ATTENDANCE_VIEW',
    'RESULT_VIEW', 'REPORT_CARD_VIEW',
    'ANNOUNCEMENT_VIEW', 'NOTIFICATION_VIEW_OWN'
);
