package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PayrollRunDto(
    UUID id,
    String runDate,       // ISO date string — when the run was executed
    String periodStart,   // ISO date string — first day of the pay period month
    String periodEnd,     // ISO date string — last day of the pay period month
    String status,        // DRAFT | APPROVED | PAID
    BigDecimal totalGrossPay,
    BigDecimal totalNetPay
) {}
