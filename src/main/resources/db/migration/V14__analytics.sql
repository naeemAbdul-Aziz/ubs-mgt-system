-- =============================================================================
-- V14 — Analytics (WP-10)
-- dashboard_stats VIEW
-- =============================================================================

CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM students) AS total_students,
    (SELECT COUNT(*) FROM staff WHERE staff_type = 'TEACHING') AS total_teachers,
    COALESCE((SELECT SUM(amount) FROM payments WHERE is_reversed = false), 0.00) AS total_revenue,
    COALESCE((SELECT SUM(total_amount - paid_amount) FROM invoices), 0.00) AS total_outstanding_fees;
