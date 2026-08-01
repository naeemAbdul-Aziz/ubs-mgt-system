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
@Table(name = "invoice_lines")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InvoiceLine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fee_item_id", nullable = false)
    private FeeItem feeItem;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    public static InvoiceLine create(FeeItem feeItem, BigDecimal amount) {
        InvoiceLine line = new InvoiceLine();
        line.setFeeItem(feeItem);
        line.setAmount(amount);
        return line;
    }
    
    void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }
}
