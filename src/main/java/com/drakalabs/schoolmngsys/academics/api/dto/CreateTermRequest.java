package com.drakalabs.schoolmngsys.academics.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateTermRequest(
        @Min(1) @Max(3) int termNumber,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate
) {}
