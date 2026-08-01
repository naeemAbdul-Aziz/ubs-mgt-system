package com.drakalabs.schoolmngsys.communication.adapter;

public interface SmsAdapter {
    SmsDeliveryResult sendSms(String recipient, String message);
}
