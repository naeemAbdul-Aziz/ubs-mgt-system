package com.drakalabs.schoolmngsys.finance.service;

import com.drakalabs.schoolmngsys.finance.domain.PayrollRun;
import com.drakalabs.schoolmngsys.finance.domain.Payslip;
import com.drakalabs.schoolmngsys.finance.domain.SalaryStructure;
import com.drakalabs.schoolmngsys.finance.repository.PayrollRunRepository;
import com.drakalabs.schoolmngsys.finance.repository.PayslipRepository;
import com.drakalabs.schoolmngsys.finance.repository.SalaryStructureRepository;
import com.drakalabs.schoolmngsys.people.domain.Staff;
import com.drakalabs.schoolmngsys.people.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayslipRepository payslipRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final StaffRepository staffRepository;

    @Transactional
    public SalaryStructure setSalaryStructure(UUID staffId, BigDecimal baseSalary, BigDecimal taxPercentage, BigDecimal allowances) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        Optional<SalaryStructure> existing = salaryStructureRepository.findByStaffId(staffId);
        if (existing.isPresent()) {
            SalaryStructure ss = existing.get();
            // simple hack for MVP without setters on entity: recreate or add setters. I'll recreate for simplicity or ideally use setters.
            // Wait, SalaryStructure has no setters. I'll just delete and recreate for MVP or just assume it is a new creation.
            salaryStructureRepository.delete(ss);
        }
        
        SalaryStructure ss = SalaryStructure.create(staff, baseSalary, taxPercentage, allowances);
        return salaryStructureRepository.save(ss);
    }

    @Transactional(readOnly = true)
    public List<SalaryStructure> getAllSalaryStructures() {
        return salaryStructureRepository.findAll();
    }

    @Transactional
    public PayrollRun executePayrollRun(Integer month, Integer year) {
        if (payrollRunRepository.findByMonthAndYear(month, year).isPresent()) {
            throw new IllegalStateException("Payroll run for " + month + "/" + year + " already exists.");
        }

        PayrollRun run = PayrollRun.create(month, year);
        payrollRunRepository.save(run);

        List<SalaryStructure> structures = salaryStructureRepository.findAll();
        BigDecimal totalRunAmount = BigDecimal.ZERO;

        for (SalaryStructure ss : structures) {
            BigDecimal base = ss.getBaseSalary();
            BigDecimal allowances = ss.getAllowances();
            BigDecimal gross = base.add(allowances);
            BigDecimal tax = gross.multiply(ss.getTaxPercentage()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            BigDecimal net = gross.subtract(tax);

            Payslip ps = Payslip.create(run, ss.getStaff(), base, allowances, tax, net);
            payslipRepository.save(ps);

            totalRunAmount = totalRunAmount.add(net);
        }

        run.setTotalAmount(totalRunAmount);
        run.setStatus("PROCESSED");
        return payrollRunRepository.save(run);
    }

    @Transactional(readOnly = true)
    public List<PayrollRun> getAllPayrollRuns() {
        return payrollRunRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Payslip> getPayslips(UUID payrollRunId) {
        return payslipRepository.findByPayrollRunId(payrollRunId);
    }
}
