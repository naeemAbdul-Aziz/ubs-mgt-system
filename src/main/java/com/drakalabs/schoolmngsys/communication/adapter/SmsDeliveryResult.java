package com.drakalabs.schoolmngsys.communication.adapter;

import java.math.BigDecimal;

public record SmsDeliveryResult(
    boolean success,
    String providerReference,
    BigDecimal cost,
    String errorMessage
) {
    public static SmsDeliveryResult success(String providerReference, BigDecimal cost) {
        return new SmsDeliveryResult(true, providerReference, cost, null);
    }
    
    public static SmsDeliveryResult failure(String errorMessage) {
        return new SmsDeliveryResult(false, null, null, errorMessage);
    }
}
