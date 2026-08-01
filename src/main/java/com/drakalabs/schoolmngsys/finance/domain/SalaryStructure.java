package com.drakalabs.schoolmngsys.finance.domain;

import com.drakalabs.schoolmngsys.people.domain.Staff;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "salary_structures")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "staff_id", nullable = false, unique = true)
    private Staff staff;

    @Column(name = "base_salary", nullable = false)
    private BigDecimal baseSalary = BigDecimal.ZERO;

    @Column(name = "tax_percentage", nullable = false)
    private BigDecimal taxPercentage = BigDecimal.ZERO;

    @Column(name = "allowances", nullable = false)
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    public static SalaryStructure create(Staff staff, BigDecimal baseSalary, BigDecimal taxPercentage, BigDecimal allowances) {
        SalaryStructure ss = new SalaryStructure();
        ss.staff = staff;
        ss.baseSalary = baseSalary;
        ss.taxPercentage = taxPercentage;
        ss.allowances = allowances;
        ss.createdAt = ZonedDateTime.now();
        ss.updatedAt = ZonedDateTime.now();
        return ss;
    }
}
