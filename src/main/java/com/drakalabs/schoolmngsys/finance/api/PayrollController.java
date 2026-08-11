package com.drakalabs.schoolmngsys.finance.api;

import com.drakalabs.schoolmngsys.finance.api.dto.*;
import com.drakalabs.schoolmngsys.finance.domain.PayrollRun;
import com.drakalabs.schoolmngsys.finance.domain.Payslip;
import com.drakalabs.schoolmngsys.finance.domain.SalaryStructure;
import com.drakalabs.schoolmngsys.finance.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/finance/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/structures")
    public ResponseEntity<SalaryStructureDto> setSalaryStructure(@RequestBody SalaryStructureRequest request) {
        SalaryStructure ss = payrollService.setSalaryStructure(
                request.getStaffId(), request.getBaseSalary(),
                request.getTaxPercentage(), request.getAllowances());
        return ResponseEntity.ok(toSalaryStructureDto(ss));
    }

    @GetMapping("/structures")
    public ResponseEntity<List<SalaryStructureDto>> getAllSalaryStructures() {
        List<SalaryStructureDto> dtos = payrollService.getAllSalaryStructures().stream()
                .map(this::toSalaryStructureDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/runs")
    public ResponseEntity<PayrollRunDto> executePayrollRun(@RequestBody PayrollRunRequest request) {
        PayrollRun run = payrollService.executePayrollRun(request.getMonth(), request.getYear());
        return ResponseEntity.ok(toPayrollRunDto(run));
    }

    @GetMapping("/runs")
    public ResponseEntity<List<PayrollRunDto>> getAllPayrollRuns() {
        List<PayrollRunDto> dtos = payrollService.getAllPayrollRuns().stream()
                .map(this::toPayrollRunDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/runs/{runId}/payslips")
    public ResponseEntity<List<PayslipDto>> getPayslips(@PathVariable UUID runId) {
        List<PayslipDto> dtos = payrollService.getPayslips(runId).stream()
                .map(this::toPayslipDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ─── Private mapping helpers ─────────────────────────────────────────────

    private SalaryStructureDto toSalaryStructureDto(SalaryStructure ss) {
        String staffName = ss.getStaff() != null
                ? ss.getStaff().getFirstName() + " " + ss.getStaff().getLastName()
                : null;
        return new SalaryStructureDto(
                ss.getId(),
                ss.getStaff() != null ? ss.getStaff().getId() : null,
                staffName,
                ss.getBaseSalary(),
                ss.getTaxPercentage(),
                ss.getAllowances(),
                ss.getUpdatedAt()
        );
    }

    private PayrollRunDto toPayrollRunDto(PayrollRun run) {
        // Convert month/year to ISO period strings for the frontend
        LocalDate periodStart = run.getRunDate() != null
                ? LocalDate.of(run.getYear(), run.getMonth(), 1)
                : LocalDate.now().withDayOfMonth(1);
        LocalDate periodEnd = periodStart.withDayOfMonth(periodStart.lengthOfMonth());
        return new PayrollRunDto(
                run.getId(),
                run.getRunDate() != null ? run.getRunDate().toString() : null,
                periodStart.toString(),
                periodEnd.toString(),
                run.getStatus(),
                run.getTotalAmount(),
                run.getTotalAmount()    // netPay = totalAmount for now (tax already deducted in service)
        );
    }

    private PayslipDto toPayslipDto(Payslip ps) {
        String staffName = ps.getStaff() != null
                ? ps.getStaff().getFirstName() + " " + ps.getStaff().getLastName()
                : null;
        return new PayslipDto(
                ps.getId(),
                ps.getPayrollRun() != null ? ps.getPayrollRun().getId() : null,
                ps.getStaff() != null ? ps.getStaff().getId() : null,
                staffName,
                ps.getBaseSalary(),
                ps.getAllowances(),
                ps.getTaxDeductions(),
                ps.getNetPay(),
                ps.getStatus(),
                ps.getPaymentDate()
        );
    }
}
