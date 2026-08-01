package com.drakalabs.schoolmngsys.finance.domain;

import com.drakalabs.schoolmngsys.people.domain.Staff;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "payslips")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_run_id", nullable = false)
    private PayrollRun payrollRun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "base_salary", nullable = false)
    private BigDecimal baseSalary = BigDecimal.ZERO;

    @Column(name = "allowances", nullable = false)
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "tax_deductions", nullable = false)
    private BigDecimal taxDeductions = BigDecimal.ZERO;

    @Column(name = "net_pay", nullable = false)
    private BigDecimal netPay = BigDecimal.ZERO;

    @Column(name = "status", nullable = false)
    private String status = "DRAFT";

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    public static Payslip create(PayrollRun payrollRun, Staff staff, BigDecimal baseSalary, BigDecimal allowances, BigDecimal taxDeductions, BigDecimal netPay) {
        Payslip ps = new Payslip();
        ps.payrollRun = payrollRun;
        ps.staff = staff;
        ps.baseSalary = baseSalary;
        ps.allowances = allowances;
        ps.taxDeductions = taxDeductions;
        ps.netPay = netPay;
        ps.createdAt = ZonedDateTime.now();
        ps.updatedAt = ZonedDateTime.now();
        return ps;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = ZonedDateTime.now();
    }
}
