-- =============================================================================
-- V4 — Academic Reference Data
-- Seeded, immutable from the application's perspective.
-- =============================================================================

-- =============================================================================
-- departments
-- =============================================================================
CREATE TABLE departments (
    id          UUID NOT NULL DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_departments PRIMARY KEY (id),
    CONSTRAINT uq_departments_code UNIQUE (code)
);

INSERT INTO departments (id, code, name) VALUES
    (gen_random_uuid(), 'NURSERY', 'Nursery'),
    (gen_random_uuid(), 'KG', 'Kindergarten'),
    (gen_random_uuid(), 'PRIMARY', 'Primary School'),
    (gen_random_uuid(), 'JHS', 'Junior High School');

-- =============================================================================
-- class_levels
-- Ordered academic ladder (BR-AS-005)
-- =============================================================================
CREATE TABLE class_levels (
    id             UUID NOT NULL DEFAULT gen_random_uuid(),
    code           TEXT NOT NULL,
    name           TEXT NOT NULL,
    basic_alias    TEXT,       -- e.g., 'Basic 1' for Primary 1
    sort_order     INT  NOT NULL,
    department_id  UUID NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by     UUID,
    updated_by     UUID,

    CONSTRAINT pk_class_levels PRIMARY KEY (id),
    CONSTRAINT uq_class_levels_code UNIQUE (code),
    CONSTRAINT fk_cl_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Seed Class Levels
DO $$
DECLARE
    dept_nurs UUID;
    dept_kg UUID;
    dept_prim UUID;
    dept_jhs UUID;
BEGIN
    SELECT id INTO dept_nurs FROM departments WHERE code = 'NURSERY';
    SELECT id INTO dept_kg FROM departments WHERE code = 'KG';
    SELECT id INTO dept_prim FROM departments WHERE code = 'PRIMARY';
    SELECT id INTO dept_jhs FROM departments WHERE code = 'JHS';

    INSERT INTO class_levels (code, name, basic_alias, sort_order, department_id) VALUES
        ('N1', 'Nursery 1', NULL, 10, dept_nurs),
        ('N2', 'Nursery 2', NULL, 20, dept_nurs),
        ('KG1', 'KG 1', NULL, 30, dept_kg),
        ('KG2', 'KG 2', NULL, 40, dept_kg),
        ('P1', 'Primary 1', 'Basic 1', 50, dept_prim),
        ('P2', 'Primary 2', 'Basic 2', 60, dept_prim),
        ('P3', 'Primary 3', 'Basic 3', 70, dept_prim),
        ('P4', 'Primary 4', 'Basic 4', 80, dept_prim),
        ('P5', 'Primary 5', 'Basic 5', 90, dept_prim),
        ('P6', 'Primary 6', 'Basic 6', 100, dept_prim),
        ('JHS1', 'JHS 1', 'Basic 7', 110, dept_jhs),
        ('JHS2', 'JHS 2', 'Basic 8', 120, dept_jhs),
        ('JHS3', 'JHS 3', 'Basic 9', 130, dept_jhs);
END $$;

-- =============================================================================
-- subjects
-- Master list of NaCCA subjects
-- =============================================================================
CREATE TABLE subjects (
    id          UUID NOT NULL DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID,
    updated_by  UUID,

    CONSTRAINT pk_subjects PRIMARY KEY (id),
    CONSTRAINT uq_subjects_code UNIQUE (code)
);

-- Basic Subject Seed (subset)
INSERT INTO subjects (code, name) VALUES
    ('ENG', 'English Language'),
    ('MATH', 'Mathematics'),
    ('SCI', 'Integrated Science'),
    ('SST', 'Social Studies'),
    ('ICT', 'Computing (ICT)'),
    ('RME', 'Religious & Moral Education'),
    ('OWOP', 'Our World Our People'),
    ('FRENCH', 'French Language'),
    ('GH_LANG', 'Ghanaian Language');
