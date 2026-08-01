-- V10 — Default Grade Scale (WP-6)
-- Seeds the default A-04 grade bands and A-03 30/70 weighting for first academic year

DO $$ 
DECLARE
    v_year_id UUID;
    v_scale_id UUID;
BEGIN
    -- Get the ACTIVE academic year (from V5 migration or default)
    -- If there's no active one yet, grab the first one
    SELECT id INTO v_year_id FROM academic_years LIMIT 1;
    
    IF v_year_id IS NOT NULL THEN
        -- Insert Grade Scale
        INSERT INTO grade_scales (id, academic_year_id, name)
        VALUES (gen_random_uuid(), v_year_id, 'Default GES Scale')
        RETURNING id INTO v_scale_id;
        
        -- Insert Grade Bands
        -- 80–100 A/Excellent, 70–79 B/Very Good, 60–69 C/Good, 50–59 D/Credit, 40–49 E/Pass, 0–39 F/Fail
        INSERT INTO grade_bands (grade_scale_id, name, min_score, max_score, point_value, remarks) VALUES
        (v_scale_id, 'A', 80.00, 100.00, 1.0, 'Excellent'),
        (v_scale_id, 'B', 70.00, 79.99, 2.0, 'Very Good'),
        (v_scale_id, 'C', 60.00, 69.99, 3.0, 'Good'),
        (v_scale_id, 'D', 50.00, 59.99, 4.0, 'Credit'),
        (v_scale_id, 'E', 40.00, 49.99, 5.0, 'Pass'),
        (v_scale_id, 'F', 0.00, 39.99, 9.0, 'Fail');
    END IF;
END $$;
