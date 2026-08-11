package com.drakalabs.schoolmngsys.finance.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PayslipDto(
    UUID id,
    UUID payrollRunId,
    UUID staffId,
    String staffName,       // "FirstName LastName" from Staff join
    BigDecimal baseSalary,
    BigDecimal allowances,
    BigDecimal taxDeductions,
    BigDecimal netPay,
    String status,
    LocalDate paymentDate
) {}
