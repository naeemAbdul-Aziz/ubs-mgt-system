package com.drakalabs.schoolmngsys.communication.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "notification_outbox")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationOutbox extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(nullable = false)
    private String payload;

    @Column(nullable = false)
    private String status;

    public static NotificationOutbox pending(String eventType, String payload) {
        NotificationOutbox outbox = new NotificationOutbox();
        outbox.setEventType(eventType);
        outbox.setPayload(payload);
        outbox.setStatus("PENDING");
        return outbox;
    }

    public void markProcessed() {
        this.setStatus("PROCESSED");
    }

    public void markFailed() {
        this.setStatus("FAILED");
    }
}
