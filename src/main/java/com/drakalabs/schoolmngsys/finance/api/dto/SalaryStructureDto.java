package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public record SalaryStructureDto(
    UUID id,
    UUID staffId,
    String staffName,   // "FirstName LastName" from Staff join
    BigDecimal baseSalary,
    BigDecimal taxPercentage,
    BigDecimal allowances,
    ZonedDateTime updatedAt
) {}
