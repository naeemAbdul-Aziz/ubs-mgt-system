package com.drakalabs.schoolmngsys.finance.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "adjustments")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Adjustment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private String status;

    public static Adjustment create(BigDecimal amount, String reason) {
        Adjustment adjustment = new Adjustment();
        adjustment.setAmount(amount);
        adjustment.setReason(reason);
        adjustment.setStatus("PENDING");
        return adjustment;
    }
    
    public void approve() {
        this.status = "APPROVED";
    }
    
    public void reject() {
        this.status = "REJECTED";
    }
    
    void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }
}
