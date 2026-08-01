-- =============================================================================
-- V21 — Seed Payroll Data for Existing Staff
-- Catching up the DB with the new V20 Payroll Module.
-- =============================================================================

DO $$
DECLARE
    v_run_1 UUID := gen_random_uuid();
    v_run_2 UUID := gen_random_uuid();
BEGIN

    -- 1. Create Salary Structures for all existing staff
    INSERT INTO salary_structures (staff_id, base_salary, tax_percentage, allowances)
    SELECT id,
           CASE staff_type
               WHEN 'TEACHING' THEN 3500.00
               ELSE 4500.00
           END,
           10.00,
           500.00
    FROM staff
    ON CONFLICT (staff_id) DO NOTHING;

    -- 2. Create Historical Payroll Runs (Last 2 Months)
    INSERT INTO payroll_runs (id, month, year, status, total_amount, run_date)
    VALUES 
        (v_run_1, EXTRACT(MONTH FROM NOW() - INTERVAL '2 MONTH'), EXTRACT(YEAR FROM NOW() - INTERVAL '2 MONTH'), 'PROCESSED', 0.00, (NOW() - INTERVAL '2 MONTH')::DATE),
        (v_run_2, EXTRACT(MONTH FROM NOW() - INTERVAL '1 MONTH'), EXTRACT(YEAR FROM NOW() - INTERVAL '1 MONTH'), 'PROCESSED', 0.00, (NOW() - INTERVAL '1 MONTH')::DATE);

    -- 3. Create Payslips for Run 1
    INSERT INTO payslips (payroll_run_id, staff_id, base_salary, allowances, tax_deductions, net_pay, status, payment_date)
    SELECT v_run_1,
           s.staff_id,
           s.base_salary,
           s.allowances,
           ((s.base_salary + s.allowances) * s.tax_percentage / 100),
           ((s.base_salary + s.allowances) - ((s.base_salary + s.allowances) * s.tax_percentage / 100)),
           'PAID',
           (NOW() - INTERVAL '2 MONTH')::DATE
    FROM salary_structures s;

    -- 4. Create Payslips for Run 2
    INSERT INTO payslips (payroll_run_id, staff_id, base_salary, allowances, tax_deductions, net_pay, status, payment_date)
    SELECT v_run_2,
           s.staff_id,
           s.base_salary,
           s.allowances,
           ((s.base_salary + s.allowances) * s.tax_percentage / 100),
           ((s.base_salary + s.allowances) - ((s.base_salary + s.allowances) * s.tax_percentage / 100)),
           'PAID',
           (NOW() - INTERVAL '1 MONTH')::DATE
    FROM salary_structures s;

    -- 5. Update Run Totals
    UPDATE payroll_runs r
    SET total_amount = (SELECT COALESCE(SUM(net_pay), 0) FROM payslips p WHERE p.payroll_run_id = r.id)
    WHERE r.id IN (v_run_1, v_run_2);

END $$;
