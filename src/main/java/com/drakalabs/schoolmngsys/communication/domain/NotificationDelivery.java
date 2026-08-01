package com.drakalabs.schoolmngsys.communication.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "notification_deliveries")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationDelivery extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outbox_id")
    private NotificationOutbox outbox;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String status;

    @Column(name = "provider_reference")
    private String providerReference;

    @Column(precision = 10, scale = 4)
    private BigDecimal cost;

    public static NotificationDelivery create(NotificationOutbox outbox, String recipient, String message) {
        NotificationDelivery delivery = new NotificationDelivery();
        delivery.setOutbox(outbox);
        delivery.setRecipient(recipient);
        delivery.setMessage(message);
        delivery.setStatus("PENDING");
        return delivery;
    }

    public void markSent(String providerReference, BigDecimal cost) {
        this.setStatus("SENT");
        this.setProviderReference(providerReference);
        this.setCost(cost);
    }

    public void markFailed() {
        this.setStatus("FAILED");
    }
}
