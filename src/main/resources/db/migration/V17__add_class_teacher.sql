-- V17 — Add Class Teacher
-- Add class_teacher_id to classes table

ALTER TABLE classes
    ADD COLUMN class_teacher_id UUID;

ALTER TABLE classes
    ADD CONSTRAINT fk_classes_teacher FOREIGN KEY (class_teacher_id) REFERENCES staff(id) ON DELETE SET NULL;
