package com.drakalabs.schoolmngsys.finance.api.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SalaryStructureRequest {
    private UUID staffId;
    private BigDecimal baseSalary;
    private BigDecimal taxPercentage;
    private BigDecimal allowances;
}
