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
@Table(name = "fee_items")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FeeItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fee_schedule_id", nullable = false)
    private FeeSchedule feeSchedule;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "is_mandatory", nullable = false)
    private boolean mandatory;

    public static FeeItem create(String description, BigDecimal amount, boolean mandatory) {
        FeeItem item = new FeeItem();
        item.setDescription(description);
        item.setAmount(amount);
        item.setMandatory(mandatory);
        return item;
    }
    
    // Package-private setter for bidirectional sync
    void setFeeSchedule(FeeSchedule schedule) {
        this.feeSchedule = schedule;
    }
}
