package com.drakalabs.schoolmngsys.communication.job;

import com.drakalabs.schoolmngsys.communication.adapter.SmsAdapter;
import com.drakalabs.schoolmngsys.communication.adapter.SmsDeliveryResult;
import com.drakalabs.schoolmngsys.communication.domain.NotificationDelivery;
import com.drakalabs.schoolmngsys.communication.domain.NotificationOutbox;
import com.drakalabs.schoolmngsys.communication.repository.NotificationDeliveryRepository;
import com.drakalabs.schoolmngsys.communication.repository.NotificationOutboxRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxProcessorJob {

    private final NotificationOutboxRepository outboxRepository;
    private final NotificationDeliveryRepository deliveryRepository;
    private final SmsAdapter smsAdapter;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 10000) // Run every 10 seconds
    @Transactional
    public void processOutbox() {
        List<NotificationOutbox> pendingRecords = outboxRepository.findTop100ByStatusOrderByCreatedAtAsc("PENDING");
        
        if (pendingRecords.isEmpty()) {
            return;
        }

        log.info("Found {} pending notification outbox records", pendingRecords.size());

        for (NotificationOutbox outbox : pendingRecords) {
            try {
                // Parse payload to get recipient and message. 
                // We assume payload is JSON like: {"recipient": "+123456789", "message": "..."}
                JsonNode payload = objectMapper.readTree(outbox.getPayload());
                String recipient = payload.has("recipient") ? payload.get("recipient").asText() : null;
                String message = payload.has("message") ? payload.get("message").asText() : null;

                if (recipient == null || message == null) {
                    log.error("Invalid payload in outbox id {}: missing recipient or message", outbox.getId());
                    outbox.markFailed();
                    continue;
                }

                // Create initial delivery record
                NotificationDelivery delivery = NotificationDelivery.create(outbox, recipient, message);
                
                // Call external SMS provider
                SmsDeliveryResult result = smsAdapter.sendSms(recipient, message);
                
                if (result.success()) {
                    delivery.markSent(result.providerReference(), result.cost());
                    outbox.markProcessed();
                } else {
                    delivery.markFailed();
                    // We can either mark outbox FAILED or keep it PENDING for retry logic. 
                    // MVP: mark as FAILED
                    outbox.markFailed();
                    log.warn("Failed to deliver SMS to {}: {}", recipient, result.errorMessage());
                }

                deliveryRepository.save(delivery);
            } catch (Exception e) {
                log.error("Error processing outbox id " + outbox.getId(), e);
                outbox.markFailed();
            }
        }
    }
}
