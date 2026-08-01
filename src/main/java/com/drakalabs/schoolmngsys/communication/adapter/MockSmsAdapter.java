package com.drakalabs.schoolmngsys.communication.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class MockSmsAdapter implements SmsAdapter {

    @Override
    public SmsDeliveryResult sendSms(String recipient, String message) {
        log.info("MOCK SMS SENT to {}: {}", recipient, message);
        
        // Return a fake success result
        return SmsDeliveryResult.success(
            "mock-ref-" + UUID.randomUUID().toString(),
            new BigDecimal("0.05") // 5 cents
        );
    }
}
