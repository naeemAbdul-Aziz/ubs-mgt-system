package com.drakalabs.schoolmngsys.finance.domain;

import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Invoice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fee_schedule_id", nullable = false)
    private FeeSchedule feeSchedule;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal paidAmount;

    @Column(nullable = false)
    private String status;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceLine> lines = new ArrayList<>();
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Adjustment> adjustments = new ArrayList<>();

    public static Invoice create(Enrollment enrollment, FeeSchedule feeSchedule, LocalDate issueDate, LocalDate dueDate) {
        Invoice invoice = new Invoice();
        invoice.setEnrollment(enrollment);
        invoice.setFeeSchedule(feeSchedule);
        invoice.setTotalAmount(BigDecimal.ZERO);
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setStatus("DRAFT");
        invoice.setIssueDate(issueDate);
        invoice.setDueDate(dueDate);
        return invoice;
    }

    public void addLine(InvoiceLine line) {
        lines.add(line);
        line.setInvoice(this);
        this.totalAmount = this.totalAmount.add(line.getAmount());
    }
    
    public void addAdjustment(Adjustment adjustment) {
        adjustments.add(adjustment);
        adjustment.setInvoice(this);
    }
    
    public void recordPaymentAllocation(BigDecimal amount) {
        this.paidAmount = this.paidAmount.add(amount);
        updateStatus();
    }
    
    private void updateStatus() {
        if (this.paidAmount.compareTo(this.totalAmount) >= 0) {
            this.status = "PAID";
        } else if (this.paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.status = "PARTIAL";
        }
    }
    
    public BigDecimal getOutstandingBalance() {
        BigDecimal totalAdjustments = adjustments.stream()
            .filter(a -> "APPROVED".equals(a.getStatus()))
            .map(Adjustment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return totalAmount.subtract(totalAdjustments).subtract(paidAmount);
    }
}
