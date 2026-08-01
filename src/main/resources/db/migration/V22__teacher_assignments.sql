-- =============================================================================
-- V22 — Teacher Assignments (Subject Level)
-- Linking Staff to Specific Subjects for Assessment Control
-- =============================================================================

-- Note: classes.class_teacher_id was already added in V17 for Form Masters.

-- 1. Add subject_teacher_id to class_subject_offerings
ALTER TABLE class_subject_offerings 
ADD COLUMN subject_teacher_id UUID;

ALTER TABLE class_subject_offerings
ADD CONSTRAINT fk_cso_teacher 
FOREIGN KEY (subject_teacher_id) REFERENCES staff(id) ON DELETE SET NULL;

-- 2. Seed Data for Teacher assignments (STF-002)
UPDATE class_subject_offerings 
SET subject_teacher_id = (SELECT id FROM staff WHERE staff_number = 'STF-002')
WHERE class_id = (
    SELECT c.id FROM classes c 
    JOIN class_levels cl ON c.class_level_id = cl.id 
    WHERE cl.code = 'PRI_3' AND c.stream = 'A'
    LIMIT 1
)
AND subject_id IN (
    SELECT id FROM subjects WHERE code IN ('MAT', 'SCI')
);
