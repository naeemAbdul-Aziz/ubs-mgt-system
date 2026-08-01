package com.drakalabs.schoolmngsys.finance.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "payroll_runs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PayrollRun {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "status", nullable = false)
    private String status = "DRAFT";

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "run_date")
    private LocalDate runDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    public static PayrollRun create(Integer month, Integer year) {
        PayrollRun run = new PayrollRun();
        run.month = month;
        run.year = year;
        run.createdAt = ZonedDateTime.now();
        run.updatedAt = ZonedDateTime.now();
        return run;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = ZonedDateTime.now();
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
