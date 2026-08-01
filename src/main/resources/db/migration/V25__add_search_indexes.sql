-- Enable pg_trgm extension for trigram similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN indexes on frequently searched columns in students table
CREATE INDEX IF NOT EXISTS idx_students_first_name_trgm ON students USING GIN (first_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_students_last_name_trgm ON students USING GIN (last_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_students_student_number_trgm ON students USING GIN (student_number gin_trgm_ops);
