package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record FeeItemDto(
    UUID id,
    String description,
    BigDecimal amount,
    boolean mandatory
) {}
