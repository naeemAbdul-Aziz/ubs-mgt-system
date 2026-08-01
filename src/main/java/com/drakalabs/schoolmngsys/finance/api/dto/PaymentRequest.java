package com.drakalabs.schoolmngsys.finance.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PaymentRequest(
    @NotNull UUID studentId,
    @NotNull @Positive BigDecimal amount,
    @NotNull LocalDate paymentDate,
    @NotNull String paymentMethod,
    String reference
) {}
