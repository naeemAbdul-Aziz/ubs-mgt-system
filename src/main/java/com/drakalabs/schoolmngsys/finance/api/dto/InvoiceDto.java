package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record InvoiceDto(
    UUID id,
    UUID enrollmentId,
    UUID feeScheduleId,
    BigDecimal totalAmount,
    BigDecimal paidAmount,
    BigDecimal outstandingBalance,
    String status,
    LocalDate issueDate,
    LocalDate dueDate,
    List<InvoiceLineDto> lines
) {}
