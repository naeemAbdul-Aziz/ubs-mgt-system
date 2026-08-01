package com.drakalabs.schoolmngsys.finance.api;

import com.drakalabs.schoolmngsys.finance.api.dto.PayrollRunRequest;
import com.drakalabs.schoolmngsys.finance.api.dto.SalaryStructureRequest;
import com.drakalabs.schoolmngsys.finance.domain.PayrollRun;
import com.drakalabs.schoolmngsys.finance.domain.Payslip;
import com.drakalabs.schoolmngsys.finance.domain.SalaryStructure;
import com.drakalabs.schoolmngsys.finance.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/structures")
    public ResponseEntity<SalaryStructure> setSalaryStructure(@RequestBody SalaryStructureRequest request) {
        SalaryStructure ss = payrollService.setSalaryStructure(request.getStaffId(), request.getBaseSalary(), request.getTaxPercentage(), request.getAllowances());
        return ResponseEntity.ok(ss);
    }

    @GetMapping("/structures")
    public ResponseEntity<List<SalaryStructure>> getAllSalaryStructures() {
        return ResponseEntity.ok(payrollService.getAllSalaryStructures());
    }

    @PostMapping("/runs")
    public ResponseEntity<PayrollRun> executePayrollRun(@RequestBody PayrollRunRequest request) {
        PayrollRun run = payrollService.executePayrollRun(request.getMonth(), request.getYear());
        return ResponseEntity.ok(run);
    }

    @GetMapping("/runs")
    public ResponseEntity<List<PayrollRun>> getAllPayrollRuns() {
        return ResponseEntity.ok(payrollService.getAllPayrollRuns());
    }

    @GetMapping("/runs/{runId}/payslips")
    public ResponseEntity<List<Payslip>> getPayslips(@PathVariable UUID runId) {
        return ResponseEntity.ok(payrollService.getPayslips(runId));
    }
}
