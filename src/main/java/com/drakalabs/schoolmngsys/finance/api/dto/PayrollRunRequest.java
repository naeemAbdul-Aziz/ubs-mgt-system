package com.drakalabs.schoolmngsys.finance.api.dto;

import lombok.Data;

@Data
public class PayrollRunRequest {
    private Integer month;
    private Integer year;
}
