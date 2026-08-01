package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PaymentDto(
    UUID id,
    UUID studentId,
    String receiptNumber,
    BigDecimal amount,
    LocalDate paymentDate,
    String paymentMethod,
    String reference,
    boolean reversed
) {}
